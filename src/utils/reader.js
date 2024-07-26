import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

const parseDocxToJson = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const zip = new PizZip(arrayBuffer);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  const docXml = zip.file('word/document.xml').asText();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(docXml, 'application/xml');
  const paragraphs = xmlDoc.getElementsByTagName('w:p');

  const result = [];
  let currentHeading = null;

  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    const isBold = p.getElementsByTagName('w:b').length > 0;
    const texts = p.getElementsByTagName('w:t');

    const paraText = Array.from(texts)
      .map((t) => t.textContent)
      .join('');

    if (isBold) {
      if (currentHeading) {
        result.push(currentHeading);
      }
      currentHeading = {
        heading: paraText,
        paragraphs: [],
      };
    } else if (currentHeading) {
      currentHeading.paragraphs.push(paraText);
    }
  }

  if (currentHeading) {
    result.push(currentHeading);
  }

  return result;
};

export default parseDocxToJson;
