import { PuffLoader } from "react-spinners";

export default function GlobalLoading() {  
    return (
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999
      }}>
        <PuffLoader color="#777" size={80} />
      </div>
    );
  }
