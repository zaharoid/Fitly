export default defineEventHandler(async () => {
    const params = '?fields=name,flag,alpha2Code,callingCodes';
    const countriesData: unknown[] = await $fetch(`https://restcountries.com/v2/all${params}`);
  
    return (countriesData || []).map((country: unknown) => ({
      id: country.alpha2Code,
      title: country.name,
      code: country.alpha2Code,
      flag: country.flag,
      callingCodes: country.callingCodes,
    }));
  });
  