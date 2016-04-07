//find dates specific for given timezone offset
fzDate = {
  getTz: (companyId) => {
    let company = Companies.findOne(companyId, { fields: {'params.tz': 1} });
    return (company) ? company.params.tz : null;
  },
  dateISO: (date, tz) => new Date(date + tz * 36e5).toISOString().slice(0, 10),
  todayISO: (tz) => new Date(Date.now() + tz * 36e5).toISOString().slice(0, 10),
  dateStart: (dateISO, tz) => new Date(new Date(dateISO) - tz * 36e5),
  todayStart: (tz) => fzDate.dateStart(fzDate.todayISO(tz), tz),
  addDays: (date, n) => new Date(date + n * 24 * 36e5),
  addMonths: (date, n, tz) => new Date(new Date(date).setMonth(date.getMonth() + n))
  addMonths: (date, n, tz) => {
    const tzDiff = (new Date().getTimezoneOffset() + tz*60)*60000,
          normalized = new Date(date + tzDiff),
    return new Date(normalized.setMonth(normalized.getMonth() + n) - tzDiff);
  }
};
