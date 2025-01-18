import { NextPageContext } from 'next'

function Error({ statusCode }: { statusCode: number }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-9xl font-bold text-gray-200">{statusCode}</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-900">
        {statusCode === 404 ? 'Page non trouvée' : 'Une erreur est survenue'}
      </h2>
      <p className="mt-2 text-gray-600 text-center max-w-md">
        {statusCode === 404
          ? 'Désolé, la page que vous recherchez n\'existe pas ou a été déplacée.'
          : 'Une erreur inattendue s\'est produite. Veuillez réessayer plus tard.'}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-8 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Rafraîchir la page
      </button>
    </div>
  )
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error 