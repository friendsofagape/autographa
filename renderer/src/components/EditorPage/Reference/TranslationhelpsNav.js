/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import styled from 'styled-components';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import { Button } from '@material-ui/core';

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
`;

const FlexSpacedDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TranslationhelpsNav = ({
    items,
    classes,
    itemIndex,
    setItemIndex,
  }) => {
    const {
      state: {
        markdown,
      },
      actions: {
        setMarkdown,
      },
    } = useContext(ReferenceContext);

    const onPrevItem = () => {
        const newIndex = itemIndex - 1;
        if (newIndex < 0) {
          setItemIndex(items.length - 1);
        } else {
          setItemIndex(newIndex);
        }
      };

      const onNextItem = () => {
        const newIndex = itemIndex + 1;
        if (newIndex > items.length - 1) {
          setItemIndex(0);
        } else {
          setItemIndex(newIndex);
        }
      };
  return (
    <>
      {items && (
      <FlexSpacedDiv>
        <ChevronLeftIcon
          className={classes.chevronIcon}
          onClick={onPrevItem}
        />
        <FlexDiv>
          {`${itemIndex + 1} of ${items.length}`}
        </FlexDiv>
        <Button
          variant="contained"
          primary
        >
          view
        </Button>
        <ChevronRightIcon
          className={classes.chevronIcon}
          onClick={onNextItem}
        />
      </FlexSpacedDiv>
        )}
    </>
    );
  };

export default TranslationhelpsNav;
