
function firstToUpperCase(lower){
  var firstLetter = lower.substring(0, 1);


  return lower.replace(firstLetter, firstLetter.toUpperCase());
}

function resolveTag(tag){
  return tag.split("-").map(firstToUpperCase).join('').replace("Controller", "");
}

export {firstToUpperCase, resolveTag};
