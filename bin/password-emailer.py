#!/usr/bin/env python3

import argparse
import datetime
import json
import logging
import os
import tempfile
import time
import uuid

from db_utils import minio_utils
from exchangelib import DELEGATE, Account, Credentials, Configuration, NTLM, Build, Version, HTMLBody, Message, \
    FileAttachment
import jinja2

# Setting up logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s-%(module)s.%(funcName)s [%(levelname)s]: %(message)s')

parser = argparse.ArgumentParser(description="Utility for emailing users of City Covid-19 dashboard their login links")

parser.add_argument('-j', '--passwords-file', required=True,
                    help='''File containing username, passwords and emails.
                    Expected structure: [{"email_address":"<email address>", "username":"<username>","password":"<password>"].")''')

parser.add_argument('-x', '--secrets', required=True,
                    help="""Secrets file containing OPM proxy and Minio access keys.
                    Expected structure: 'proxy' -> ['username', 'password'], 'minio' -> 'edge' -> ['access', 'secret']""")

parser.add_argument('-e', '--email', required=True,
                    help="""File containing HTML email template""")

parser.add_argument('-l', '--logo', required=True,
                    help="""File containing the City's logo""")

parser.add_argument('-d', '--not-a-drill', required=False, default=False, action="store_true",
                    help="""Boolean flag indicating the emails *should* actually be sent.""")

args, _ = parser.parse_known_args()
passwords_filename = args.passwords_file
secrets_filename = args.secrets
email_filename = args.email
logo_filename = args.logo

dry_run = not args.not_a_drill
logging.warning(f"This {'is' if dry_run else '*is not*'} a drill")
if not dry_run:
    logging.info("Giving you 5 seconds to reconsider...")
    time.sleep(5)

# Checking arguments
for file_path in [passwords_filename, secrets_filename, email_filename, logo_filename]:
    assert os.path.exists(file_path), f"'{file_path}' doesn't exist, sorry!"

# Loading secrets
with open(secrets_filename, "r") as secrets_file:
    secrets = json.load(secrets_file)

# Loading passwords
with open(passwords_filename, "r") as passwords_file:
    passwords = json.load(passwords_file)

# Loading email template
with open(email_filename, "r") as email_file:
    email_template = jinja2.Template(email_file.read())

logging.info("Loaded Secrets, Password and Email template file.")

# Setting up Exchange Creds
version = Version(build=Build(15, 0, 1395, 4000))
credentials = Credentials(username=secrets['proxy']['username'],
                          password=secrets["proxy"]["password"])
config = Configuration(
    server="webmail.capetown.gov.za",
    credentials=credentials,
    version=version,
    auth_type=NTLM
)
account = Account(
    primary_smtp_address="opm.data@capetown.gov.za",
    config=config, autodiscover=False,
    access_type=DELEGATE
)
logging.info("Authenticated with Exchange")

with open(logo_filename, 'rb') as fp:
    city_logo_attachment = FileAttachment(name='city_logo.png', content=fp.read())

for receiver_dict in passwords:
    logging.debug(f"receiver_dict['username']={receiver_dict['username']}, "
                  f"receiver_dict['email_address']={receiver_dict['email_address']}")
    message_uuid = str(uuid.uuid4())
    iso8601_timestamp = datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f%z')
    logging.debug(f"message_uuid={message_uuid}, iso8601_timestamp={iso8601_timestamp}")

    subject = "Access to City's Covid-19 Pandemic Dashboard"

    body = email_template.render(
        username=receiver_dict["username"],
        password=receiver_dict["password"],
        dashboard_link="ds3.capetown.gov.za/covid-dash2/ct-covid-dash-city.html",
        request_id=message_uuid,
        iso8601_timestamp=iso8601_timestamp
    )

    message_dict = dict(subject=subject,
                        body=HTMLBody(body),
                        to_recipients=[receiver_dict["email_address"]], )
    message = Message(account=account, **message_dict)
    message.attach(city_logo_attachment)

    logging.info(f"Saving {message_uuid}.json to Minio")
    with tempfile.TemporaryDirectory() as tempdir:
        local_path = os.path.join(tempdir, f"{message_uuid}.json")
        with open(local_path, "w") as message_file:
            json.dump(message_dict, message_file)

        minio_utils.file_to_minio(
            filename=local_path,
            minio_bucket="covid-19-dash-user-cred-emails",
            minio_key=secrets["minio"]["edge"]["access"],
            minio_secret=secrets["minio"]["edge"]["secret"],
            data_classification=minio_utils.DataClassification.EDGE,
        )

    if not dry_run:
        logging.info(f"Sending email to {receiver_dict['email_address']}")
        message.send(save_copy=False)
