import { Link } from 'react-router-dom'
import LandingCard from '../components/LandingCard'
import FilterTypes from '../components/FilterTypes'
import { useAllOrganisations } from '../hooks/useOrganisations'
import {
  IfAuthenticated,
  IfNotAuthenticated,
} from '../components/Authenticated'
import { useAuth0 } from '@auth0/auth0-react'
import { useState } from 'react'
import { useAllTypes } from '../hooks/useTypes'

export default function LandingPage() {
  const { loginWithRedirect } = useAuth0()
  const { data, isPending, isError, error } = useAllOrganisations()
  const {
    data: typeData,
    isPending: typeIsPending,
    isError: typeIsError,
    error: typeError,
  } = useAllTypes()
  const [selectedType, setSelectedType] = useState('')

  const handleSignIn = () => {
    console.log('sign in')
    loginWithRedirect({
      authorizationParams: {
        redirect_uri: `${window.location.origin}/register`,
      },
    })
  }

  if (isPending) return <p>Yoo hold up brother!</p>
  if (isError) return <p>Naa bao, it aint working: {error.message}</p>

  if (typeIsPending) return <p>Gathering resources...</p>
  if (typeIsError)
    return <p>Oops! Cannot find the donation type: {typeError.message}</p>

  return (
    <div className="container">
      <h1 className="text-3xl font-bold">DonateMate</h1>
      <IfAuthenticated>
        <Link to="/org/signup">
          <button className="primary_button bg-blue hover:bg-darkerTeal flex items-center space-x-4 rounded px-4 py-2 transition duration-300">
            Sign Up!
          </button>
        </Link>
      </IfAuthenticated>
      <IfNotAuthenticated>
        <button
          className="primary_button bg-blue hover:bg-darkerTeal flex items-center space-x-4 rounded px-4 py-2 transition duration-300"
          onClick={handleSignIn}
        >
          Sign Up!
        </button>
      </IfNotAuthenticated>
      <div className="filterTypes">
        <FilterTypes selectedTypeName={setSelectedType} />
      </div>
      <div className="image-grid">
        {data
          .filter(
            (org) =>
              typeData.filter(
                (type) =>
                  type.name === selectedType && type.organisationId === org.id,
              ).length === 1 || !selectedType,
          )
          .map((organisation, i) => (
            <Link to={`/org/${organisation.id}`} key={i}>
              <LandingCard
                name={organisation.name}
                src={organisation.image}
                alt={organisation.name}
                orgId={organisation.id}
              />
            </Link>
          ))}
      </div>
    </div>
  )
}
