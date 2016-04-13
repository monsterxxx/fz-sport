//find dates specific for given timezone offset
fzDate = {
  getTz: (companyId) => {
    let company = Companies.findOne(companyId, { fields: {'params.tz': 1} });
    return (company) ? company.params.tz : null;
  },
  dateISO: (date, tz) => new Date(date.getTime() + tz * 36e5).toISOString().slice(0, 10),
  todayISO: (tz) => new Date(Date.now() + tz * 36e5).toISOString().slice(0, 10),
  dateStart: (dateISO, tz) => new Date(new Date(dateISO).getTime() - tz * 36e5),
  todayStart: (tz) => fzDate.dateStart(fzDate.todayISO(tz), tz),
  addDays: (date, n) => new Date(date.getTime() + n * 24 * 36e5),
  addMonths: (date, n, tz) => {
    const tzDiff = new Date('1970-01-01T00:00'+ date.toString().slice(28, 33)).getTime() + tz * 36e5,
          normalized = new Date(date.getTime() + tzDiff);
    return new Date(normalized.setMonth(normalized.getMonth() + n) - tzDiff);
  }
};
