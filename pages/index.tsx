import cloudinaryApi from 'apis/cloudinary'
import { Header } from 'components'
import type { NextPage } from 'next'
import { useTheme } from 'next-themes'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useFolderStore } from 'stores/folderStore'
import { formatDate } from 'utils/date'

const Home: NextPage = ({
  folders,
}: {
  folders: any
}) => {

  const { setTheme } = useTheme()
  useEffect(() => { 
    setTheme('dark')
  }, [])

  const router = useRouter()
  const { add } = useFolderStore()

  function goToFolder(folderName: string) {
    let selectedFolder = folders.filter(x => x.name == folderName)[0]
    add(selectedFolder)
    router.push(`/images/${folderName}`);
  }

  return (
    <>
      <Head>
        <title>MR - Fotografias</title>
      </Head>
      <div className="min-h-screen bg-gray-50 dark:bg-background-dark">
        <Header showGoBack={false} />
        <div className='flex flex-col justify-center items-center p-2 sm:p-5'>          
          <h1 className='text-3xl font-bold'>MR FOTOGRAFIAS</h1>
          <div className='my-5 grid grid-cols-9'>
            {
              folders.map((folder) => {
                let date = new Date(folder.lastUpdate);
                return (
                  <div key={folder.name} className='col-span-3 border border-solid border-border-light dark:border-border-dark rounded-xl mx-1 sm:mx-3 my-3 justify-center p-3 items-center cursor-pointer' onClick={() => goToFolder(folder.name)}>
                    <p className='text-center overflow-hidden text-ellipsis'>{folder.name}</p>
                    <p className='text-center'>{formatDate(date)}</p>
                  </div>
                )
              })
            }
          </div>
          <h1 className='text-2xl font-semibold mt-2 mb-1'>Bem-vindo à MR Fotografias!</h1>
          <p className='lg:mx-[15%] xl:mx-[30%] text-center my-2'>Capturamos momentos especiais com paixão e dedicação. Explore nossa galeria de eventos e reviva suas memórias favoritas através das nossas lentes.</p>
          <button
              className="border border-solid border-border-light dark:border-border-dark rounded-xl px-4 py-2 mt-3"
              onClick={() => window.location.href = process.env.NEXT_PUBLIC_INSTAGRAM_URL}
              title="Saiba mais"
            >
              Saiba mais
          </button>
        </div>
      </div>
    </>
  )
}

export default Home

export async function getStaticProps() {
  const resultFolders = await cloudinaryApi.getFolders();
  const result = await Promise.all(
    resultFolders.folders.map(async x => {
      return {
        name: x.name,
        lastUpdate: await cloudinaryApi.getLastFolderAlteration(x.name)
      };
    })
  );

  return {
    props: {
      folders: result
    },
    revalidate: 60, 
  }
}