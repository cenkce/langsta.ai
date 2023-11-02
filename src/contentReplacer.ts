import { getSelectedTextSelectors } from "./domain/utils/getSelectedText";

export function escapeRegexSpecialChars(textToEscape: string) {
  return textToEscape.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// export function findContentNode(
//   node: ChildNode,
//   replacementDetails: Record<string, any>
// ) {
//   const nodeList = node.childNodes;

//   for (let x = 0; x < nodeList.length; x++) {
//     // text node, search directly
//     if (nodeList[x].nodeType == 3) {
//       Object.keys(replacementDetails).forEach((key) => {
//         const textContent = nodeList[x].textContent;
//         if (textContent !== null && textContent.length > 20) {
//           console.log(key);
//         }
//       });
//     } else
//       replaceValuesInHtmlDocumentTextContent(nodeList[x], replacementDetails);
//   }
// }
export function replaceValuesInHtmlDocumentTextContent(
  node?: ChildNode,
) {
  console.log( getSelectedTextSelectors() );

  return node;
}

export function JaroWrinker(s1: string, s2: string) {
  let m = 0;

  // Exit early if either are empty.
  if (s1.length === 0 || s2.length === 0) {
    return 0;
  }

  // Exit early if they're an exact match.
  if (s1 === s2) {
    return 1;
  }

  const range = Math.floor(Math.max(s1.length, s2.length) / 2) - 1,
    s1Matches: boolean[] = new Array(s1.length),
    s2Matches: boolean[] = new Array(s2.length);

  for (let i = 0; i < s1.length; i++) {
    const low = i >= range ? i - range : 0,
      high = i + range <= s2.length ? i + range : s2.length - 1;

    for (let j = low; j <= high; j++) {
      if (s1Matches[i] !== true && s2Matches[j] !== true && s1[i] === s2[j]) {
        ++m;
        s1Matches[i] = s2Matches[j] = true;
        break;
      }
    }
  }

  // Exit early if no matches were found.
  if (m === 0) {
    return 0;
  }

  // Count the transpositions.
  let k = 0,
    n_trans = 0;

  for (let i = 0; i < s1.length; i++) {
    if (s1Matches[i] === true) {
      let j = k;
      for (j = k; j < s2.length; j++) {
        if (s2Matches[j] === true) {
          k = j + 1;
          break;
        }
      }
      if (s1[i] !== s2[j]) {
        ++n_trans;
      }
    }
  }

  let weight = (m / s1.length + m / s2.length + (m - n_trans / 2) / m) / 3;
  const p = 0.1;
  let l = 0;

  if (weight > 0.7) {
    while (s1[l] === s2[l] && l < 4) {
      ++l;
    }

    weight = weight + l * p * (1 - weight);
  }

  return weight;
}
