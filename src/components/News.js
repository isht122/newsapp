import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component'

const News = (props) => {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, settotalResults] = useState(0)

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }



    


    const updateNews = async () => {
        props.setProgress(10);
        const url = `https://gnews.io/api/v4/top-headlines?country=${props.country}&category=${props.category}&apikey=${props.apiKey}&lang=en&page=${page}&max=${props.pageSize}`;
        setLoading(true);
        let data = await fetch(url);
        props.setProgress(30);
        let parsedData = await data.json();
        props.setProgress(70);
        if (parsedData.articles) {
        setArticles(parsedData.articles)
        settotalResults(parsedData.totalArticles)
    }
        setLoading(false)


        props.setProgress(100);
    }

    useEffect(() => {
         document.title = `${capitalizeFirstLetter(props.category)} - NewsAdda`;
        updateNews();
        // eslint-disable-next-line
    }, [])


    // const handlePrevClick = async () => {
    //     setPage(page - 1)
    //     updateNews();
    // }

    // const handleNextClick = async () => {

    //     setPage(page + 1)
    //     updateNews();
    // }

    const fetchMoreData = async () => {
        
        const url = `https://gnews.io/api/v4/top-headlines?country=${props.country}&category=${props.category}&apikey=${props.apiKey}&lang=en&page=${page + 1}&max=${props.pageSize}`;
        setPage(page + 1)
        let data = await fetch(url);
        let parsedData = await data.json();
        console.log(parsedData);
        setArticles(articles.concat(parsedData.articles || []),)
        settotalResults(parsedData.totalArticles)

    };


    return (
        <>
            <h1 className="text-center" style={{ margin: '35px 0px', marginTop: '90px'}}>News Adda - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
            {loading && <Spinner />}
            <InfiniteScroll
                dataLength={articles.length}
                next={fetchMoreData}
                hasMore={articles.length !== totalResults}
                loader={<h4><Spinner /></h4>}
            >



                <div className="container">
                    <div className="row">
                        {articles.map((element) => {
                            return <div className="col-md-4" key={element.url}>
                                <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""}
                                    imageUrl={element.image} newsUrl={element.url} author={element.author} date={element.publishedAt}
                                    source={element.source.name} />
                            </div>
                        })}
                    </div>
                </div>

            </InfiniteScroll>
            {/* <div className="container d-flex justify-content-between">
                <button disabled={page <= 1} type="button" className="btn btn-dark" onClick={handlePrevClick}> &larr; Previous</button>
                <button disabled={page + 1 > Math.ceil(totalResults / props.pageSize)} type="button" className="btn btn-dark" onClick={handleNextClick}> Next &rarr;</button>

            </div> */}
        </>

    )

}

News.defaultProps = {
    country: 'in',
    pageSize: 6,
    category: 'general'
}
News.propTypes = {
    country: PropTypes.string,
    category: PropTypes.string,
    pageSize: PropTypes.number

}


export default News
