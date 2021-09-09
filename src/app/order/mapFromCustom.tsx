import { CustomItem } from '@bigcommerce/checkout-sdk';

import { OrderSummaryItemProps } from './OrderSummaryItem';

function mapFromCustom(item: CustomItem): OrderSummaryItemProps {
    return {
        id: item.id,
        quantity: item.quantity,
        amount: item.extendedListPrice,
        name: item.name,
        brand: 'Just Sunnies',
        categoryNames: [],
    };
}

export default mapFromCustom;
