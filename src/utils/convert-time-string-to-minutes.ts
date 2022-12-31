export function convertTimeStringToMinutes(timeString: string) {
  const [hours, minutes] = timeString.split(':').map(Number)

  const hoursInMinutes = hours * 60

  return hoursInMinutes + minutes
}
