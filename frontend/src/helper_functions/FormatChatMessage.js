function FormatChatMessage(text, maxLen = 15) {
  try{
  const result = [];
  let line = "";

  // Split but preserve words (multiple spaces handled later)
  const words = text.split(/\s+/);

  for (let word of words) {
    // Case 1: word itself is longer than maxLen
    if (word.length > maxLen) {
      // Push current line if not empty
      if (line.trim()) {
        result.push(line.trimEnd());
        line = "";
      }

      // Split long word
      for (let i = 0; i < word.length; i += maxLen) {
        result.push(word.slice(i, i + maxLen));
      }
      continue;
    }

    // Check if word fits in current line
    const tentative = line ? line + " " + word : word;

    if (tentative.length <= maxLen) {
      line = tentative;
    } else {
      // Push current line & move word to next line
      result.push(line.trimEnd());
      line = word;
    }
  }

  // Push remaining line
  if (line.trim()) {
    result.push(line.trimEnd());
  }

  return result.join("\n");
  }
  catch(err){
    return text;
  }
}

function TruncateChatMessage(text, maxLen = 20) {
  if (!text) return "";

  if (text.length <= maxLen) {
    return text;
  }

  return text.slice(0, maxLen) + "...";
}

export {FormatChatMessage , TruncateChatMessage};

