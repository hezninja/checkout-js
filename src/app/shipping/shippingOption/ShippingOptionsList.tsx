import { ShippingOption } from '@bigcommerce/checkout-sdk';
import React, { memo, useCallback, FunctionComponent } from 'react';
import { preventDefault } from '../../common/dom';

import { EMPTY_ARRAY } from '../../common/utility';
import { Checklist, ChecklistItem } from '../../ui/form';
import { LoadingOverlay } from '../../ui/loading';

import StaticShippingOption from './StaticShippingOption';

interface ShippingOptionListItemProps {
    consignmentId: string;
    shippingOption: ShippingOption;
}

const ShippingOptionListItem: FunctionComponent<ShippingOptionListItemProps> = ({
    consignmentId,
    shippingOption,
}) => {
    const renderLabel = useCallback(() => (
        <div className="shippingOptionLabel">
            <StaticShippingOption displayAdditionalInformation={ true } method={ shippingOption } />
        </div>
    ), [shippingOption]);

    return <ChecklistItem
        htmlId={ `shippingOptionRadio-${consignmentId}-${shippingOption.id}` }
        label={ renderLabel }
        value={ shippingOption.id }
    />;
};

export interface ShippingOptionListProps {
    consignmentId: string;
    inputName: string;
    isLoading: boolean;
    selectedShippingOptionId?: string;
    shippingOptions?: ShippingOption[];
    onSelectedOption(consignmentId: string, shippingOptionId: string): void;
}

const toggleClickCollect = () => {
    document.querySelectorAll(`.collectOptions`).forEach(elem => {
        elem.classList.toggle('active');
    });
};

const ShippingOptionsList: FunctionComponent<ShippingOptionListProps> = ({
    consignmentId,
    inputName,
    isLoading,
    shippingOptions = EMPTY_ARRAY,
    selectedShippingOptionId,
    onSelectedOption,
 }) => {
    const handleSelect = useCallback((value: string) => {
        onSelectedOption(consignmentId, value);
    }, [
        consignmentId,
        onSelectedOption,
    ]);

    if (!shippingOptions.length) {
        return null;
    }

    return (
        <LoadingOverlay isLoading={ isLoading }>
            <Checklist
                aria-live="polite"
                defaultSelectedItemId={ selectedShippingOptionId }
                name={ inputName }
                onSelect={ handleSelect }
            >
                { shippingOptions.map(shippingOption => {
                    if (shippingOption.type !== 'shipping_pickupinstore') {
                        return(
                            <ShippingOptionListItem
                                consignmentId={ consignmentId }
                                key={ shippingOption.id }
                                shippingOption={ shippingOption }
                            />
                        );
                    }
                }) }
                <li className="clickAndCollect">
                    <div className="collectHeading" onClick={ preventDefault(() => toggleClickCollect()) }>
                        <div className="shippingOptionLabel">
                            <div className="shippingOption shippingOption--alt">
                                <span className="shippingOption-desc">
                                    Click &amp; Collect
                                    <span className="shipping-sub-text">Gold Coast, Queensland</span>
                                </span>
                                <span className="shippingOption-price">FREE</span>
                            </div>
                        </div>
                    </div>
                    <div className="collectOptions">
                        <ul>
                            { shippingOptions.map(shippingOption => {
                                if (shippingOption.type === 'shipping_pickupinstore') {
                                    return(
                                        <ShippingOptionListItem
                                            consignmentId={ consignmentId }
                                            key={ shippingOption.id }
                                            shippingOption={ shippingOption }
                                        />
                                    );
                                }
                            }) }
                        </ul>
                    </div>
                </li>
            </Checklist>
        </LoadingOverlay>
    );
};

export default memo(ShippingOptionsList);
