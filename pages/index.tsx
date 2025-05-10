import { Header } from 'components'
import type { NextPage } from 'next'
import { useTheme } from 'next-themes'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useFolderStore } from 'stores/folderStore'
import { formatDate } from 'utils/date'
import foldersApi from './api/find-folders'
import GlobalLoading from 'components/loading'

const Home: NextPage = ({ folders }: { folders: any }) => {
  const { setTheme } = useTheme()
  useEffect(() => {
    setTheme('dark')
  }, [])

  const [isLoad, setIsLoad] = useState(false)

  const router = useRouter()
  const { add } = useFolderStore()

  function goToFolder(folderName: string) {
    setIsLoad(true)
    let selectedFolder = folders.filter(x => x.name == folderName)[0]
    add(selectedFolder)
    router.push({
      pathname: `/images/${folderName}`,
      query: { render: selectedFolder.render }
    })
  }

  return (
    <>
      <Head>
        <title>MR - Fotografias</title>
      </Head>
      {!isLoad && (
        <div className="min-h-screen bg-gray-50 dark:bg-background-dark">
          <Header showGoBack={false} />
          <div className="flex flex-col items-center justify-center p-2 sm:p-5">
            <h1 className="text-3xl font-bold">MR FOTOGRAFIAS</h1>
            <div className="my-5 grid grid-cols-9">
              {folders.map(folder => {
                let date = new Date(folder.lastUpdate)
                return (
                  <div
                    key={folder.name}
                    className="col-span-3 mx-1 my-3 cursor-pointer items-center justify-center rounded-xl border border-solid border-border-light p-3 dark:border-border-dark sm:mx-3"
                    onClick={() => goToFolder(folder.name)}
                  >
                    <p className="overflow-hidden text-ellipsis text-center">
                      {folder.name}
                    </p>
                    <p className="text-center">{formatDate(date)}</p>
                  </div>
                )
              })}
            </div>
            <h1 className="mb-1 mt-2 text-2xl font-semibold">
              Bem-vindo à MR Fotografias!
            </h1>
            <p className="my-2 text-center lg:mx-[15%] xl:mx-[30%]">
              Capturamos momentos especiais com paixão e dedicação. Explore
              nossa galeria de eventos e reviva suas memórias favoritas através
              das nossas lentes.
            </p>
            <button
              className="mt-3 rounded-xl border border-solid border-border-light px-4 py-2 dark:border-border-dark"
              onClick={() =>
                (window.location.href = process.env.NEXT_PUBLIC_INSTAGRAM_URL)
              }
              title="Saiba mais"
            >
              Saiba mais
            </button>
          </div>
        </div>
      )}
      {isLoad && <GlobalLoading />}
    </>
  )
}

export default Home

export async function getStaticProps() {
  const result = await foldersApi(null, null)
  return {
    props: {
      folders: result
    },
    revalidate: 60
  }
}
