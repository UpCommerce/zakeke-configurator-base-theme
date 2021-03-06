import React, { FunctionComponent } from 'react';
import { useZakeke } from 'zakeke-configurator-react';
import { useState } from 'react';
import { useEffect } from 'react';
import { List, ListItem, ListItemImage } from './list';
import styled from 'styled-components';

const Container = styled.div`
    height: 100%;
    overflow: auto;
`;

const Selector: FunctionComponent<{}> = () => {

    const { isSceneLoading, productName, isAddToCartLoading, price, groups, selectOption, addToCart } = useZakeke();

    // Keep saved the ID and not the refereces, they will change on each update
    const [selectedGroupId, selectGroup] = useState<number | null>(null);
    const [selectedStepId, selectStep] = useState<number | null>(null);
    const [selectedAttributeId, selectAttribute] = useState<number | null>(null);

    const selectedGroup = groups.find(group => group.id === selectedGroupId);
    const selectedStep = selectedGroup ? selectedGroup.steps.find(step => step.id === selectedStepId) : null;

    // Attributes can be in both groups and steps, so show the attributes of step or in a group based on selection
    const attributes = (selectedStep || selectedGroup)?.attributes ?? [];
    const selectedAttribute = attributes.find(attribute => attribute.id === selectedAttributeId);

    // Open the first group and the first step when loaded
    useEffect(() => {
        if (!selectedGroup && groups.length > 0) {
            selectGroup(groups[0].id);

            if (groups[0].steps.length > 0)
                selectStep(groups[0].steps[0].id);
        }
    }, [selectedGroup, groups]);

    // Select attribute first time
    useEffect(() => {
        if (!selectedAttribute && attributes.length > 0)
            selectAttribute(attributes[0].id);
    }, [selectedAttribute, attributes])


    if (isSceneLoading || !groups || groups.length === 0)
        return <span>Loading configurator...</span>;

    // groups
    // -- attributes
    // -- -- options
    // -- steps
    // -- -- attributes
    // -- -- -- options

    return <Container>
        <h1>{productName}</h1>
        <List>
            {groups.map(group => {
                return <ListItem key={group.id} onClick={() => selectGroup(group.id)} selected={selectedGroup === group}>Group: {group.id === -1 ? 'Other' : group.name}</ListItem>;
            })}
        </List>

        {selectedGroup && selectedGroup.steps.length > 0 && <List>
            {selectedGroup.steps.map(step => {
                return <ListItem key={step.id} onClick={() => selectStep(step.id)} selected={selectedStep === step}>Step: {step.name}</ListItem>;
            })}
        </List>}

        <List>
            {attributes && attributes.map(attribute => {
                return <ListItem key={attribute.id} onClick={() => selectAttribute(attribute.id)} selected={selectedAttribute === attribute}>Attribute: {attribute.name}</ListItem>;
            })}
        </List>

        <List>
            {selectedAttribute && selectedAttribute.options.map(option => {
                return <ListItem key={option.id} onClick={() => selectOption(option.id)} selected={option.selected}>
                    {option.imageUrl && <ListItemImage src={option.imageUrl} />}
                    Option: {option.name}
                </ListItem>;
            })}
        </List>

        <h3>Price: {price}</h3>
        {isAddToCartLoading ? 'Adding to cart...' : <button onClick={addToCart}>Add to cart</button>}

    </Container>
}

export default Selector; 