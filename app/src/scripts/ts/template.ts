const DATE_BORN = new Date("2004-07-02");
const currentDate = new Date();
const currentYear = currentDate.getFullYear();

export const applyTemplate = () => {
  const ageContainer = document.getElementById("dynamic-age");

  if (ageContainer) {
    let age = currentYear - DATE_BORN.getFullYear();
    const monthDifference = currentDate.getMonth() - DATE_BORN.getMonth();
    const dayDifference = currentDate.getDate() - DATE_BORN.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0))
      age--;

    ageContainer.textContent = String(age);
  }

  const dateContainer = document.getElementById("dynamic-year");
  if (dateContainer) dateContainer.textContent = String(currentYear);
};
