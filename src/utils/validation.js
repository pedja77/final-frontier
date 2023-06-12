const validateText = (text, re, minLength, maxLength) => {
  return re.test(text) && (text.length >= minLength) && (text.length <= maxLength);
};

const validateNumber = (number, max, min = 0) => {
  return number >= min && number <= max;
};

// Jedna reč, samo slovni karakteri uključujući kuke i kvačke
export const validateFirstName = (firstName) => {
  const isValid = validateText(firstName, /^[a-zšđčćž]+$/giu, 2, 30);
  return {
    valid: isValid,
    cause: isValid ? 'Ime' : 'Ime mora da ima od 2 do 30 karaktera, samo alfa karakteri' 
  };
};

export const validateLastName = (lastName) => {
  const isValid = validateText(lastName, /^[a-zšđčćž]+$/giu, 2, 30);
  return {
    valid: isValid,
    cause: isValid ? 'Prezime' : 'Prezime mora da ima od 2 do 30 karaktera, samo alfa karakteri'
  };
};

export const validateWeeklyFund = (fund) => {
  const isValid = validateNumber(fund, 5);
  return {
    valid: isValid,
    cause: isValid ? 'Nedeljni fond' : 'Nedeljni fond časova mora biti pozitivan broj manji od 6'
  };
};

export const validateWeeklyClasses = (fund) => {
  const isValid = validateNumber(fund, 40);
  return {
    valid: isValid,
    cause: isValid ? 'Nedeljni fond nastavnika' : 'Nedeljni fond časova nastavnika mora biti pozitivan broj manji od 41'
  };
};

export const validateUsername = (username) => {
  const isValid = validateText(userName, /[\wšđžčć]+/gi, 4, 12);
  return {
    valid: isValid,
    cause: isValid ? 'Korisničko ime' : 'Korisničko ime mora biti od 4 do 12 karaktera dugačko; slova, brojevi i donja crta'
  }
};

export const validatePassword = (password) => {
    const isValid = validateText(password, /(?:)/g, 5, 10);
    return {
      valid: isValid,
      cause: isValid ? 'Lozinka' : 'Lozinka mora biti dužine od 5 do 10 karaktera'
    }
};

export const validateConfirmedPassword = (p, cp) => {
    const isValid = p === cp;
    return {
      valid: isValid,
      cause: isValid ? 'Potvrda lozinke' : 'Potvrđena lozinka mora biti jednaka lozinci'
    }
};

// String može da sadrži više reči, samo slovni karakteri, može space ili više na kraju
export const validateSubjectName = subjectName => {
    const isValid = validateText(subjectName, /^([a-zšđčćž])+( [a-zšđčćž]*)*$/gui, 3, 30);
    return {
      valid: isValid,
      cause: isValid ? 'Naziv predmeta' : 'Naziv predmeta mora biti od 3 do 30 karaktera dugačak, može sadržati više reči razdvojenih razmakom'
    }
}

export const isFormValid = (errors, attr) => {
  for (let k of attr) {
    if(!errors[k].valid)
      return false;
  }
  return true;
};

