import React, { useEffect } from "react";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { useRSS } from "../api";
// import { Card } from './Card';
import { Indicator } from "./Indicator";
import {
  FaDiscourse,
  FaMedium,
  FaReddit,
  FaRedditSquare,
} from "react-icons/fa";

interface NewsItem {
  link: string;
  date: dayjs.Dayjs;
  title: string;
  snippet: string;
  source: "official" | "reddit" | "forum";
}

const Container = styled.div`
  padding: 0.5rem;
  margin-top: 0 !important;

  h2 {
    text-align: left;
  }
`;

const NewsCard = styled(Card)`
  margin-top: 0.5rem !important;

  &.reddit {
    border-color: var(--news-reddit);
  }
  &.official {
    border-color: var(--news-nano);
  }
  &.forum {
    border-color: var(--news-forum);
  }

  @media (max-width: 540px) {
    width: 100%;
    box-sizing: border-box;
    padding-right: 0;
    margin-right: -1rem;
    padding-right: 0.5rem;
    margin-left: calc(-1rem + 8px);
    padding-left: calc(1rem - 8px);
  }

  h3 {
    display: flex;
    @media (max-width: 540px) {
      margin-right: -1rem;
    }

    img {
      width: 1rem;
    }

    img,
    svg {
      margin-right: 0.5rem;
    }

    a {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      // max-width: 48ch;

      @media (max-width: 540px) {
        max-width: 25ch;
      }
    }
  }

  sub {
    margin-left: auto;
    font-size: 0.85rem;
    white-space: nowrap;
  }

  p {
    text-align: left;
  }
`;

function convertFeedItems(source: "reddit" | "forum", data?: any): NewsItem[] {
  return (
    data?.items
      ?.map((item: any) => ({
        link: item.link,
        date: dayjs(item.isoDate),
        title: item.title,
        snippet: item.contentSnippet,
        source,
      }))
      .sort(
        (a: NewsItem, b: NewsItem) =>
          b.date.toDate().getTime() - a.date.toDate().getTime()
      )
      .slice(0, 5) ?? []
  );
}

export const News: React.FC = () => {
  const redditQuery = useRSS("reddit");
  const nfQuery = useRSS("nf");
  const forumQuery = useRSS("forum");

  const nfPosts: NewsItem[] =
    nfQuery.data?.items
      .map(
        (item: any) =>
          ({
            link: item.link,
            date: dayjs(item.isoDate),
            title: item.title,
            snippet: item["content:encodedSnippet"],
            source: "official",
          } as NewsItem)
      )
      .sort(
        (a: NewsItem, b: NewsItem) =>
          b.date.toDate().getTime() - a.date.toDate().getTime()
      )
      .slice(0, 5) ?? [];
  const redditPosts: NewsItem[] = convertFeedItems("reddit", redditQuery.data);
  const forumPosts: NewsItem[] = convertFeedItems("forum", forumQuery.data);
  const posts = [...nfPosts, ...redditPosts, ...forumPosts].sort(
    (a, b) => b.date.toDate().getTime() - a.date.toDate().getTime()
  );
  console.log(posts);
  return (
    <Indicator show={redditQuery.isLoading || nfQuery.isLoading}>
      <Container>
        <h2>Nano Community News Feed:</h2>
        {redditQuery.isError && JSON.stringify(redditQuery.error)}
        <div className="news-feed-container">
          {posts.map((item) => (
            <Card
              sx={{ maxWidth: 260, minWidth: 260 }}
              key={item.link}
              className={item.source}
              style={{ margin: "20px" }}
            >
              <CardActionArea
                component="a"
                color="text.secondary"
                href={item.link}
                target="_blank"
                rel="noopener noreferrer nofollow"
                style={{ textDecoration: "none" }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={
                    item.source == "reddit"
                      ? require("url:../assets/rediit.png")
                      : item.source == "forum"
                      ? require("url:../assets/discourse.png")
                      : require("url:../assets/nano.png")
                  }
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {item.title}
                  </Typography>
                  <Typography>{item.date.format("L")}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </div>
      </Container>
    </Indicator>
  );
};

// <NewsCard key={item.link} className={item.source}>
//   <h3>
//     { item.source === 'reddit' ? <FaReddit/> : item.source === 'forum' ? <FaDiscourse/> : <img src={require('url:../../assets/nano.png')}/> }
//     <a href={item.link} target="_blank" rel="noopener noreferrer nofollow">{ item.title }</a>
//     <sub>{ item.date.format('L') }</sub>
//   </h3>
// </NewsCard>
