import { useLang } from '../contexts/LanguageContext';

const Paginator = ({ currentPage, totalItems, pageSize, onPageChange }) => {
  const { lang } = useLang();
  const totalPages = Math.ceil(totalItems / pageSize);
  if(totalPages <= 1) return null;

  const pages = [];
  for(let i=1; i<=totalPages; i++) pages.push(i);

  return (
    <div className="paginator">
      <button
        className="page-btn"
        disabled={currentPage === 1}
        onClick={()=>onPageChange(currentPage-1)}
      >
        ‹
      </button>
      {pages.map(p=>(
        <button
          key={p}
          className={`page-btn ${p === currentPage ? 'active' : ''}`}
          onClick={()=>onPageChange(p)}
        >
          {p}
        </button>
      ))}
      <button
        className="page-btn"
        disabled={currentPage === totalPages}
        onClick={()=>onPageChange(currentPage+1)}
      >
        ›
      </button>
    </div>
  );
};

export default Paginator;
