import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 text-center">
          <div>
            <p className="font-serif text-4xl text-gold mb-4">Ceva nu a mers bine.</p>
            <p className="text-brand-muted mb-6">Te rugăm reîncarcă pagina.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-outline"
            >
              Reîncarcă
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
