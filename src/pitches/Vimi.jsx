import { useState } from 'react';

const VimiPrototype = () => {
  const [selectedStandard, setSelectedStandard] = useState(null);

  const standards = [
    {
      id: 1,
      title: "4.NF.A.1 - Equivalent Fractions",
      description: "Explain why a fraction a/b is equivalent to a fraction (n × a)/(n × b).",
      status: "Mapped",
      misconceptions: [
        {
          trigger: "Adds numerator and denominator",
          intervention: "Visual area model forcing multiplicative scaling",
          dok: "DoK 2"
        },
        {
          trigger: "Multiplies only the numerator",
          intervention: "Identity property of multiplication review (n/n = 1)",
          dok: "DoK 1"
        }
      ]
    },
    {
      id: 2,
      title: "4.NF.A.2 - Compare Fractions",
      description: "Compare two fractions with different numerators and different denominators.",
      status: "Mapped",
      misconceptions: [
        {
          trigger: "Larger denominator = larger fraction",
          intervention: "Unit fraction comparison tool (1/8 vs 1/4 size)",
          dok: "DoK 2"
        },
        {
          trigger: "Compares without common denominator",
          intervention: "Forced normalization step before comparison",
          dok: "DoK 3"
        }
      ]
    },
    {
      id: 3,
      title: "4.NF.B.3 - Add/Subtract Fractions",
      description: "Understand addition and subtraction of fractions as joining and separating parts referring to the same whole.",
      status: "Drafting",
      misconceptions: []
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-slate-900 text-white p-4 shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Vimi Architecture Demo</h1>
          <p className="text-xs text-slate-400">Knowledge Spine & Misconception Substrate</p>
        </div>
        <div className="bg-purple-900/50 border border-purple-500/30 text-purple-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center">
          <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></span>
          Simulated Data / Architectural Mockup
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Knowledge Spine */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b border-slate-200 pb-2 text-slate-700">1. Linear Knowledge Spine</h2>
          <p className="text-sm text-slate-500 mb-4">The surface layer of the adaptive path.</p>
          
          <div className="space-y-3">
            {standards.map(std => (
              <div 
                key={std.id}
                onClick={() => setSelectedStandard(std)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selectedStandard?.id === std.id ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800">{std.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${std.status === 'Mapped' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {std.status}
                  </span>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2">{std.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Misconception Substrate */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col">
          <div className="bg-slate-100 p-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">2. Misconception Substrate</h2>
            <p className="text-sm text-slate-500">The hidden routing layer behind "adaptivity".</p>
          </div>
          
          <div className="p-6 flex-1 bg-slate-50">
            {!selectedStandard ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <p>Select a node from the spine to view its underlying substrate.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">{selectedStandard.title}</h3>
                  <p className="text-sm text-slate-600 border-l-2 border-blue-400 pl-3">{selectedStandard.description}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">Diagnostic Triggers</h4>
                  {selectedStandard.misconceptions.length === 0 ? (
                    <p className="text-sm italic text-slate-500 bg-white p-3 rounded border border-dashed border-slate-300">No misconceptions mapped yet. AI tutor will default to generic hints.</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedStandard.misconceptions.map((misc, idx) => (
                        <div key={idx} className="bg-white border border-rose-200 rounded-lg p-4 shadow-sm relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full bg-rose-400"></div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-bold text-rose-700 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              Trigger: {misc.trigger}
                            </span>
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-mono">{misc.dok}</span>
                          </div>
                          <div className="bg-blue-50 text-blue-800 p-2 rounded text-sm mt-2 border border-blue-100">
                            <span className="font-semibold">Routing:</span> {misc.intervention}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default VimiPrototype;
