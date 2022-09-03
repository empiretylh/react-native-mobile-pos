export const validateEmail = text => {
  console.log(text);
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  if (reg.test(text) === false) {
    console.log('Email is Not Correct');

    return false;
  } else {
    console.log('Email is Correct');
    return true;
  }
};

export const validatePhoneNumber = text => {
  console.log(text);
  let reg = /^\d{11}$/;
  if (reg.test(text) === false) {
    console.log('PhoneNumber is Not Correct');

    return false;
  } else {
    console.log('PhoneNumber is Correct');
    return true;
  }
};

String.prototype.replaceAllTxt = function replaceAll(search, replace) {
  return this.split(search).join(replace);
};

export const validateUsername = text => {
  if (text) {
    let usernameRegex = /^[a-zA-Z0-9]+$/;
    if (usernameRegex.test(text) == false) {
      return false;
    } else {
      return true;
    }
  }
};



export const validateShopName = text => {
  console.log(text);
  let reg = /^\d{11}$/;
  // if (reg.test(text) === false) {
  //   console.log('PhoneNumber is Not Correct');

  //   return false;
  // } else {
  //   console.log('PhoneNumber is Correct');
  //   return true;
  // }
  if(text){
    return true;
  }else{
    return false;
  }
};
