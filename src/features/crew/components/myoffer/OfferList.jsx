/**
 * OfferList.jsx
 *
 * Renders the scrollable list of offer rows inside the left panel.
 * Handles empty state. Delegates row rendering to OfferListItem.
 *
 * Props:
 *   offers        — array of offer objects
 *   selectedOffer — currently selected offer (or null)
 *   onSelect      — (offer) => void
 *   activeStage   — string key of active stage filter (or null)
 */

import { OfferListItem } from "./OfferListItem";

export function OfferList({ offers = [], selectedOffer, onSelect, activeStage }) {
  if (!offers.length) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-[12px] text-neutral-400">
          {activeStage ? "No offers in this stage" : "No offers found"}
        </p>
      </div>
    );
  }

  return offers.map((offer, idx) => (
    <OfferListItem
      key={offer._id}
      offer={offer}
      index={idx}
      isSelected={selectedOffer?._id === offer._id}
      onClick={() => onSelect(offer)}
    />
  ));
}