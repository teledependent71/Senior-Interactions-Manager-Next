import React from 'react'
import Head from 'next/head'

import { DataProvider, Repeater } from '@teleporthq/react-components'
import PropTypes from 'prop-types'
import {
  getEntitiesWithPagination,
  getEntities,
} from '@teleporthq/cms-mappers/caisy'

const Author1 = (props) => {
  return (
    <>
      <div className="author1-container">
        <Head>
          <title>Author - Senior Interactions Manager</title>
          <meta
            property="og:title"
            content="Author - Senior Interactions Manager"
          />
        </Head>
        <DataProvider
          renderSuccess={(params) => (
            <>
              <Repeater
                items={params}
                renderItem={(AuthorEntities) => (
                  <>
                    <div className="author1-container1">
                      <h1>{AuthorEntities?.name}</h1>
                      <span>{AuthorEntities?.name}</span>
                      <span>{AuthorEntities?.id}</span>
                    </div>
                  </>
                )}
              />
            </>
          )}
          initialData={props.authorEntities}
          persistDataDuringLoading={true}
          key={props?.pagination?.page}
        />
      </div>
      <style jsx>
        {`
          .author1-container {
            width: 100%;
            display: flex;
            overflow: auto;
            min-height: 100vh;
            align-items: center;
            flex-direction: column;
          }
          .author1-container1 {
            gap: 12px;
            width: 100%;
            display: flex;
            align-items: center;
            flex-direction: column;
          }
        `}
      </style>
    </>
  )
}

Author1.defaultProps = {
  authorEntities: [],
}

Author1.propTypes = {
  authorEntities: PropTypes.array,
}

export default Author1

export async function getStaticProps(context) {
  try {
    const response = await getEntitiesWithPagination({
      ...context?.params,
      projectId: '3bd8eb33-2aaa-4620-87bf-d7ccd04d0245',
      query:
        'query MyQuery($first: Int, $after: String){allAuthor(first: $first, after: $after){pageInfo{endCursor,hasNextPage,hasPreviousPage}edges{node{_meta{createdAt updatedAt id}name image{__typename _meta{createdAt updatedAt id}description height id src title width}}}}}',
      page: context.params.page,
      perPage: 10,
    })
    if (!response) {
      return {
        notFound: true,
      }
    }
    return {
      props: {
        authorEntities: response,
        ...response?.meta,
      },
      revalidate: 60,
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}

export async function getStaticPaths() {
  try {
    const response = await getEntities({
      projectId: '3bd8eb33-2aaa-4620-87bf-d7ccd04d0245',
      query: '{allAuthor{edges{node{id}}}}',
    })
    const totalCount = response?.meta?.pagination?.total
    const pagesCount = Math.ceil(totalCount / 10)
    return {
      paths: Array.from(
        {
          length: pagesCount,
        },
        (_, i) => ({
          params: {
            page: (i + 1).toString(),
          },
        })
      ),
      fallback: 'blocking',
    }
  } catch (error) {
    return {
      paths: [],
      fallback: 'blocking',
    }
  }
}
