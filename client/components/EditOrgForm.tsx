import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import EditCard from './EditCard.tsx'
import { Organisation } from '../../models/modelOrganisations.ts'
import { useOrganisationsById } from '../hooks/useOrganisations.ts'
import EditHowToAdd from './EditHowToAdd.tsx'
import EditCurrentlyAccepting from './EditCurrentlyAccepting.tsx'
import EditAbout from './EditAbout.tsx'
import { useTypesById } from '../hooks/useTypes.ts'

interface Props {
  organisation: Organisation
  onUpdate: () => void
}

type FormState = {
  orgName: string
  orgContactDetails: string
  orgAbout: string
  orgLongitude: number
  orgLatitude: number
  orgTypes: string
  orgImage: string
  orgVolunteeringNeeded: boolean
  orgMethod: string
}

export default function EditOrgForm({ organisation, onUpdate }: Props) {
  const { getAccessTokenSilently } = useAuth0()
  const [form, setForm] = useState<FormState>({
    orgName: '',
    orgContactDetails: '',
    orgAbout: '',
    orgLongitude: 0,
    orgLatitude: 0,
    orgTypes: '',
    orgImage: '',
    orgVolunteeringNeeded: false,
    orgMethod: '',
  })

  const org = useOrganisationsById(organisation.id)
  const donationTypes = useTypesById(organisation.id)

  const handleMutationSuccess = () => {
    onUpdate()
  }

  const mutationOptions = {
    onSuccess: handleMutationSuccess,
  }

  if (org.isPending || donationTypes.isPending) {
    return <p>You are loved 💖...</p>
  }

  if (org.isError || donationTypes.isError) {
    return (
      <p>
        uh oh, something went wrong...{' '}
        {org.error?.message || donationTypes.error?.message}
      </p>
    )
  }

  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    const token = await getAccessTokenSilently().catch(() => {
      console.error('Login Required')
      return 'undefined'
    })
    if (event) {
      event.preventDefault()
    }
    org.patchOrgData.mutate(
      {
        id: organisation.id,
        token: token,
        orgData: {
          id: 0,
          name: form.orgName,
          contactDetails: form.orgContactDetails,
          about: form.orgAbout,
          longitude: organisation.longitude,
          latitude: organisation.latitude,
          orgTypes: form.orgTypes,
          image: form.orgImage,
          volunteeringNeeded: form.orgVolunteeringNeeded,
          method: form.orgMethod,
        },
      },
      mutationOptions,
    )
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setForm({
      ...form,
      [name]: value,
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <EditCard
          form={organisation}
          orgName={form.orgName}
          orgContactDetails={form.orgContactDetails}
          handleChange={() => handleChange}
        />
        <EditAbout
          form={organisation}
          orgAbout={form.orgAbout}
          handleChange={() => handleChange}
        />
        <EditHowToAdd
          form={organisation}
          orgHowToAdd={form.orgMethod}
          handleChange={() => handleChange}
        />
        <EditCurrentlyAccepting form={donationTypes.data} handleUpdate={} />
      </form>
    </>
  )
}
