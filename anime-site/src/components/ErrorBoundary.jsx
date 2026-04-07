import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050510] text-white p-6 text-center">
          <h2 className="text-3xl font-cinematic font-bold mb-4 text-red-500 uppercase tracking-widest">
            A Glitch in the Matrix
          </h2>
          <p className="text-violet-300/60 max-w-md mb-8 font-display uppercase tracking-widest text-xs leading-loose">
            The cinematic engine encountered a fatal error. 
            <br />
            Our legends are currently undergoing maintenance.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 rounded-full bg-primary/20 border border-primary/40 hover:bg-primary/40 transition-all uppercase tracking-widest text-xs font-bold"
          >
            Reconnect to the Cycle
          </button>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-8 p-4 bg-black/50 rounded text-left text-[10px] max-w-full overflow-auto border border-white/5 text-red-400">
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
