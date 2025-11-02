import { useState } from 'react';
import svgPaths from "../pages/svg-pfzv1oe4vh";

export function Pagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 68;

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex gap-[8px] items-center justify-center">
      {/* Previous Button */}
      <button 
        className={`box-border content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0 ${
          currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'
        }`}
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        <div className="overflow-clip relative shrink-0 size-[16px]">
          <div className="absolute inset-[20.833%]">
            <div className="absolute inset-[-8.571%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
                <path 
                  d={svgPaths.p146ed1c0} 
                  stroke="#1E1E1E" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="1.6" 
                />
              </svg>
            </div>
          </div>
        </div>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#757575] text-[16px] text-nowrap whitespace-pre">
          Previous
        </p>
      </button>

      {/* Page Numbers */}
      <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
        <button 
          className={`box-border content-stretch flex flex-col items-center justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0 ${
            currentPage === 1 ? 'bg-[#c80a0a]' : 'hover:bg-gray-100'
          }`}
          onClick={() => handlePageClick(1)}
        >
          <p className={`font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-nowrap whitespace-pre ${
            currentPage === 1 ? 'text-neutral-100' : 'text-[#1e1e1e]'
          }`}>
            1
          </p>
        </button>

        <button 
          className={`box-border content-stretch flex flex-col items-center justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0 ${
            currentPage === 2 ? 'bg-[#c80a0a]' : 'hover:bg-gray-100'
          }`}
          onClick={() => handlePageClick(2)}
        >
          <p className={`font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-nowrap whitespace-pre ${
            currentPage === 2 ? 'text-neutral-100' : 'text-[#1e1e1e]'
          }`}>
            2
          </p>
        </button>

        <button 
          className={`box-border content-stretch flex flex-col items-center justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0 ${
            currentPage === 3 ? 'bg-[#c80a0a]' : 'hover:bg-gray-100'
          }`}
          onClick={() => handlePageClick(3)}
        >
          <p className={`font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-nowrap whitespace-pre ${
            currentPage === 3 ? 'text-neutral-100' : 'text-[#1e1e1e]'
          }`}>
            3
          </p>
        </button>

        <div className="box-border content-stretch flex flex-col items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[1.4] not-italic relative shrink-0 text-[16px] text-black text-nowrap whitespace-pre">
            ...
          </p>
        </div>

        <button 
          className={`box-border content-stretch flex flex-col items-center justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0 ${
            currentPage === 67 ? 'bg-[#c80a0a]' : 'hover:bg-gray-100'
          }`}
          onClick={() => handlePageClick(67)}
        >
          <p className={`font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-nowrap whitespace-pre ${
            currentPage === 67 ? 'text-neutral-100' : 'text-[#1e1e1e]'
          }`}>
            67
          </p>
        </button>

        <button 
          className={`box-border content-stretch flex flex-col items-center justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0 ${
            currentPage === 68 ? 'bg-[#c80a0a]' : 'hover:bg-gray-100'
          }`}
          onClick={() => handlePageClick(68)}
        >
          <p className={`font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-nowrap whitespace-pre ${
            currentPage === 68 ? 'text-neutral-100' : 'text-[#1e1e1e]'
          }`}>
            68
          </p>
        </button>
      </div>

      {/* Next Button */}
      <button 
        className={`box-border content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0 ${
          currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'
        }`}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[#1e1e1e] text-[16px] text-nowrap whitespace-pre">
          Next
        </p>
        <div className="overflow-clip relative shrink-0 size-[16px]">
          <div className="absolute inset-[20.833%]">
            <div className="absolute inset-[-8.571%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
                <path 
                  d={svgPaths.p190b8180} 
                  stroke="#1E1E1E" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="1.6" 
                />
              </svg>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
