import React from 'react';
import { Card, Icon } from 'antd';

function CardComponent(props) {

  const { Meta } = Card;
 
  return (
    <Card
    style={{ width: 300 }}
    cover={
      <img
        alt={props.cardInfo.fields.description.stringValue}
        src={props.cardInfo.fields.image.stringValue}
      />
    }
    actions={[
      <a target="_blank" rel="noopener noreferrer" href={props.cardInfo.fields.link.stringValue}>
          <Icon type="ellipsis" key="ellipsis" />
      </a>
    ]}
  >
    <Meta
      title={props.cardInfo.fields.stack.stringValue}
      description={props.cardInfo.fields.description.stringValue}
    />
  </Card>
  );
}

export default CardComponent;