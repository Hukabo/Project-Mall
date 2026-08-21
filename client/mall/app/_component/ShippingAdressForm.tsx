"use client";

import { Dispatch, SetStateAction, useState } from "react";
import DaumPostcodeModal from "./DaumPostcodeModal";
import { JoinForm } from "../join/page";

export default function ShippingAddressForm({
  address,
  setForm,
}: {
  address: AddressForm;
  setForm: Dispatch<SetStateAction<JoinForm>>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2 w-full max-w-md mt-8">
      <div className="flex gap-2">
        <input
          type="text"
          value={address.zonecode}
          readOnly
          placeholder="우편번호"
          className="border border-line rounded px-3 py-1.5 w-1/3 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-4 py-1.5 border border-grey-dark-1 rounded whitespace-nowrap"
        >
          주소 검색
        </button>
        {isOpen && (
          <DaumPostcodeModal
            onComplete={(data) =>
              setForm((prev) => ({
                ...prev,
                address: {
                  ...prev.address,
                  zonecode: data.zonecode,
                  roadAddress: data.roadAddress,
                },
              }))
            }
            onClose={() => setIsOpen(false)}
          />
        )}
      </div>

      <input
        type="text"
        value={address.roadAddress}
        readOnly
        placeholder="도로명 주소"
        className="border border-line rounded px-3 py-1.5 focus:outline-none"
      />

      <input
        type="text"
        value={address.detailAddress}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            address: { ...prev.address, detailAddress: e.target.value },
          }))
        }
        placeholder="상세 주소 입력"
        className="border border-line rounded px-3 py-1.5 focus:outline-none"
      />
    </div>
  );
}
