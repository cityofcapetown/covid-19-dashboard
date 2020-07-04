import argparse
import os
import logging

import jinja2

DIRECTORATE_TUPLES = (
    # directorate_title, directorate_filename_prefix, sr_plot_flag, hr_plot_flag, department tuples
    ("Citywide", "city", True, True, ()),
    ('Water and Waste', "water_and_waste", True, True, (
        'Project Monitoring Unit', 'Water and Sanitation Services', 'Solid Waste Management',
    )),
    ('Energy and Climate Change', "energy_and_climate_change", True, False, ()),
    ('Finance', "finance", True, True, (
        "Revenue", "Supply Chain Management", "Expenditure", "Valuations", "Grant Funding", "Budgets", "Finance",
        "Treasury Services", "Support Services", "Cape Town Stadium"
    )),
    ("Human Settlements", "human_settlements", True, True, (
        "Informal Settlements", "Public Housing", "Operational Policy and Planning", "Finance", "Support Services",
        "Housing Development", "Project Management Office HS"
    )),
    ('Community Service and Health', "community_services_and_health", True, False, (
        "Planning and Development and PMO", "Recreation and Parks", "City Health"
    )),
    ("Transport", "transport", True, True, (
        "Roads Infrastructure and Management", "Transport Planning", "Public Transport Operations", "Network Management",
        "Integrated Transport Portfolio", "Business Enablement", "Administrative Support", "Finance",
        "Project Management Office Transport"
    )),
    ("Corporate Services", "corporate_services", True, True, (
        "Organisational Effectiveness andInnovation", "Information Systems and Technology", "Policy and Strategy",
        "Communications", "Legal Services", "Information and Knowledge Management", "Human Resources",
        "Executive Committees and Corporate Services Operations", "Resilience", "Customer Relations",
        "Organisational Performance Management", "Corp Project Programme and Portfolio Man", "Office Administration"
    )),
    # ("Safety and Security", "safety_and_security", False, False, ()),
    ("Economic Opportunities and Asset Management", "economic_opportunities_and_asset_management", True, True, (
        "Strategic Assets", "Facilities Management", "Property Management", "Enterprise and Investment",
        "Support Services", "Fleet Management", "Finance", "Office Administration Manager_EOAM", "PMO - EOAM",
    )),
    ("Spatial Planning and Environment", "spatial_planning_and_environment", True, True, (
        "Environmental Management", "Urban Planning and Design", "Urban Catalytic Investment", "Development Management",
        "Project Management Office", "HR Business Partner", "Finance", "Support Services"
    )),
    ("Urban Management", "urban_management", False, True, (
        "Area North", "PMO", "MURP Area East", "MURP Area North", "MURP Technical Support", "MURP Area Central",
        "MURP Area South", "Area South", "Area East", "Councillor Support", "HR Business Partner", "Support Services",
        "Finance", "Public Participation", "City Improvement Districts", "EPWP and CDW", "Area Central"
    )),
    ('Office of the City Manager', "city_manager", False, True, (
        "Probity", "Legal Compliance", "Office of the CM"
    )),
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
    logging.basicConfig(level=logging.DEBUG,
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
