interface Country {
  overall_rank: Number;
  country_or_region: String;
  score: Number;
  gdp_per_capita: Number;
  social_support: Number;
  healthy_life_expectancy: Number;
  freedom_to_make_life_choices: Number;
  generosity: Number;
  perceptions_of_corruption: Number;
}

export async function getAllCountries() {
  return await findAllCountries();
}
