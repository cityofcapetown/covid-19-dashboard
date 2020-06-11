import argparse
import os
import logging

import jinja2

DISTRICT_TUPLES = (
    # ('City', 'all'),
    ('Eastern', 'eastern'),
    ('Klipfontein', 'klipfontein'),
    ('Southern', 'southern'),
    ('Mitchells Plain', 'mitchells_plain'),
    ('Khayelitsha', 'khayelitsha'),
    ('Northern', 'northern'),
    ('Western', 'western'),
    ('Tygerberg', 'tygerberg'),
)

if __name__ == "__main__":
    # Setting up logging
    logging.basicConfig(level=logging.INFO,
                        format='%(asctime)s-%(module)s.%(funcName)s [%(levelname)s]: %(message)s')

    parser = argparse.ArgumentParser(
        description="Utility script for generating general Covid-19 City dashboard")

    parser.add_argument('-t', '--template', required=True,
                        help='Jinja template to use to generate file')

    parser.add_argument('-o', '--output-path', required=True,
                        help="""Output path to write file""")

    args, _ = parser.parse_known_args()
    template_filepath = args.template
    output_path = args.output_path

    logging.info("Reading template")
    with open(template_filepath, "r") as template_file:
        template_code = template_file.read()

    logging.info("Generating HTML")
    template = jinja2.Template(template_code)
    rendered_file = template.render(district_tuples=DISTRICT_TUPLES)

    logging.info("Writing out HTML file")
    *_, template_filename = os.path.split(template_filepath)
    output_filepath = os.path.join(output_path, template_filename)
    logging.debug(f"output_filename={output_filepath}")
    with open(output_filepath, "w") as output_file:
        output_file.write(rendered_file)

    logging.info("Done!")
