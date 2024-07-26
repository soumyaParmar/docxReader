import { useState } from 'react';
import parseDocxToJson from './utils/reader';

const App = () => {
  const [jsonData, setJsonData] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const json = await parseDocxToJson(file);
      console.log(json)
      setJsonData(json);
    }
  };

  return (
    <div>
      <input type="file" accept=".docx" onChange={handleFileChange} />
      {jsonData && (
        jsonData.map((item,index)=>(
          <div key={index}>
            <h1 style={{font:'20px',fontWeight:'bolder'}}>{item.heading}</h1>
            {item.paragraphs.map((item1,index1)=>(
              <p key={index1}>
                {item1}
              </p>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default App;
