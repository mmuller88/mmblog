import React, { useEffect, useState } from 'react';
import { AnchorLink } from 'gatsby-plugin-anchor-links';
// eslint-disable-next-line import/no-unresolved
import { useLocation } from '@reach/router';
import tw, { styled } from 'twin.macro';

export const Aside = tw.aside`sticky top-5 md:w-44 pt-12`;

export const ContentsTitle = tw.h5`font-semibold pb-2 m-0`;

export const Item = tw.li`pt-2 text-stone-800`;

export const StyledAnchorLink = styled(AnchorLink)`
  ${tw`transition-all duration-100 no-underline`}
  ${(props) => (props.active ? tw`text-stone-800` : tw`md:text-stone-500`)}
`;

function getIds(items) {
  return items.reduce((acc, item) => {
    if (item.url) {
      acc.push(item.url.slice(1));
    }
    if (item.items) {
      acc.push(...getIds(item.items));
    }
    return acc;
  }, []);
}

function useActiveId(itemIds) {
  const [activeId, setActiveId] = useState('test');
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0% 0% -80% 0%' },
    );
    itemIds.forEach((id) => {
      observer.observe(document.getElementById(id));
    });
    return () => {
      observer.disconnect();
    };
  }, [itemIds]);
  return activeId;
}

function renderItems(items, activeId) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  return (
    <ul>
      {items.map((item) => (
        <Item key={item.url}>
          <StyledAnchorLink
            to={`${pathname}${item.url}`}
            active={activeId === item.url.slice(1) ? 1 : 0}
          >
            {item.title}
          </StyledAnchorLink>
          {item.items && renderItems(item.items, activeId)}
        </Item>
      ))}
    </ul>
  );
}

const TableOfContents = ({ items }) => {
  const idList = getIds(items);
  const activeId = useActiveId(idList);
  if (typeof window === 'undefined' || !items) {
    return (<> </>);
  }
  return (
    <Aside>
      <ContentsTitle>Table of Contents</ContentsTitle>
      {renderItems(items, activeId)}
    </Aside>
  );
};

export default TableOfContents;
