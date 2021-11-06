import { useStateIPC } from 'electron-state-ipc/react';
import React from 'react';

function Form() {
  const [text, setText] = useStateIPC('text', '');
  return (
    <div className="m-2">
      <input id="input" className="form-control" value={text} onChange={(e) => setText(e.target.value)} />
      <div id="text" className="alert alert-primary mt-2" role="alert">
        {text}
      </div>
    </div>
  );
}

export default Form;
