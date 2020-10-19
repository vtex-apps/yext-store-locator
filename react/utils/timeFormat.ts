type Format = '12H' | '24H'

const timeFormat = (time: string, format?: Format) => {
  const [hour, minute] = time.split(':')

  if (format?.toLocaleLowerCase() === '12h') {
    return `${
      parseInt(hour, 10) > 12 ? parseInt(hour, 10) - 12 : hour
    }:${minute}${parseInt(hour, 10) >= 12 ? ' pm' : ' am'}`
  }

  return `${hour}:${minute}`
}

export default timeFormat
