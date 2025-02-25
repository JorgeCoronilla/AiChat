import { useEffect, useState } from 'react';
import styles from '../page.module.css';

interface ModelSelectorProps {
  modelName: string;
  setModelName: (modelName: string) => void;
}
export default function ModelSelector({ modelName, setModelName }: ModelSelectorProps) {
      const [models, setModels] = useState<{ name: string }[]>([]);

    useEffect(() => {
        fetch('http://localhost:11434/api/tags')
          .then((res) => res.json())
          .then((data) => {
            setModels(data.models);
            setModelName(data.models[0].name || '');
            console.log(data);
          })
          .catch((err) => console.error('Error fetching models:', err));
      }, []);
  return (
    <div className={styles.selectContainer}>

    <select
      className={styles.select}
      value={modelName}
      onChange={(e) => setModelName(e.target.value)}
    >
      {models.map((model) => (
        <option key={model.name} value={model.name}>
          {model.name}
        </option>
      ))}
    </select>
  </div>
  );
}