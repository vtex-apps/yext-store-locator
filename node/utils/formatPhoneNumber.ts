const formatPhoneNumber = (phoneNumber: string) => {
  const cleaned = `${phoneNumber}`.replace(/\D/g, '')
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)

  if (match) {
    return ['(', match[2], ') ', match[3], '-', match[4]].join('')
  }

  return null
}

export default formatPhoneNumber
