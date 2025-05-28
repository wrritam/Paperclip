import React, { ReactNode, Suspense } from 'react'

type Props = {
   children: ReactNode
}

const layout = ({ children }: Props) => {
  return (
    <Suspense>
      {children}
    </Suspense>
  )
}

export default layout
