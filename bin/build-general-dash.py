import argparse
import os
import logging

import jinja2

DIRECTORATE_TUPLES = (
    # directorate_title, directorate_filename_prefix, sr_plot_flag, hr_plot_flag
    ("Citywide", "city", True, True),
    ('Water and Waste', "water_and_waste", True, True),
    ('Energy and Climate Change', "energy_and_climate_change", True, False),
    ('Finance', "finance", True, True),
    ("Human Settlements", "human_settlements", True, True),
    ('Community Service and Health', "community_services_and_health", True, False),
    ("Transport", "transport", True, True),
    ("Corporate Services", "corporate_services", True, True),
    #("Safety and Security", "safety_and_security", False, False),
    ("Economic Opportunities and Asset Management", "economic_opportunities_and_asset_management", True, True),
    ("Spatial Planning and Environment", "spatial_planning_and_environment", True, True),
    ("Urban Management", "urban_management", False, True),
    ('Office of the City Manager', "city_manager", False, True),
)

SERVICE_REQUEST_TIME_PERIOD_TUPLES = (
    # (time_period_prefix, time_period_Title)
    ("last_week", "Last Week"),
    ("last_day", "Last Day"),
    ("last_month", "Last Month"),
    ("since_sod", "Since 2020-03-15")
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
    rendered_file = template.render(directorate_tuples=DIRECTORATE_TUPLES,
                                    service_request_time_periods=SERVICE_REQUEST_TIME_PERIOD_TUPLES)

    logging.info("Writing out HTML file")
    *_, template_filename = os.path.split(template_filepath)
    output_filepath = os.path.join(output_path, template_filename)
    logging.debug(f"output_filename={output_filepath}")
    with open(output_filepath, "w") as output_file:
        output_file.write(rendered_file)

    logging.info("Done!")
