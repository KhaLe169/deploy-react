import React, { useState } from 'react';

export default function CheckoutInfo({ setCheckoutInfo, products, price, checkoutInfo }) {
    const [openSection, setOpenSection] = useState(1);
    const toggleAccordion = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <div
            id="accordion-open"
            data-accordion="open"
            data-active-classes="bg-white text-gray-900"
            data-inactive-classes="text-gray-500"
        >
            <h2 id="accordion-open-heading-1">
                <button
                    type="button"
                    onClick={() => toggleAccordion(1)}
                    aria-expanded={openSection === 1}
                    class="flex items-center justify-between w-full py-5 font-medium rtl:text-right text-gray-500 border-b-2 border-gray-400 gap-3"
                    data-accordion-target="#accordion-open-body-1"

                    aria-controls="accordion-open-body-1"

                >
                    <span class="text-xl font-bold">Shipping address</span>
                    <svg
                        data-accordion-icon
                        class="w-3 h-3 rotate-180 shrink-0"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5 5 1 1 5"
                        />
                    </svg>
                </button>
            </h2>
            <div
                style={{ display: openSection === 1 ? 'block' : 'none' }}
                id="accordion-open-body-1"
                class="hidden"
                aria-labelledby="accordion-open-heading-1"
            >
                <div class="py-5 border-b-2 border-gray-400">
                    <form class="border-gray-200 my-4 p-4 rounded-lg bg-gray-50">
                        <div class="space-y-6">
                            <div>
                                <label
                                    for="phone"
                                    class="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Phone number
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    defaultValue={checkoutInfo.phoneNumber}
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="(+84)"
                                    pattern="^(\+84)?[0-9]{8,}$"
                                    required
                                    onChange={(e) => setCheckoutInfo((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label
                                    for="city"
                                    class="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    City
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    defaultValue={checkoutInfo.city}
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    required
                                    onChange={(e) => setCheckoutInfo((prev) => ({ ...prev, city: e.target.value }))}
                                />
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label
                                        for="district"
                                        class="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        District
                                    </label>
                                    <input
                                        type="text"
                                        id="district"
                                        defaultValue={checkoutInfo.district}
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        required
                                        onChange={(e) => setCheckoutInfo((prev) => ({ ...prev, district: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label
                                        for="ward"
                                        class="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Ward
                                    </label>
                                    <input
                                        type="text"
                                        id="ward"
                                        defaultValue={checkoutInfo.ward}
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        required
                                        onChange={(e) => setCheckoutInfo((prev) => ({ ...prev, ward: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    for="streetAddress"
                                    class="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Street address
                                </label>
                                <input
                                    type="text"
                                    id="streetAddress"
                                    defaultValue={checkoutInfo.streetAddress}
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    required
                                    onChange={(e) => setCheckoutInfo((prev) => ({ ...prev, streetAddress: e.target.value }))}
                                />
                            </div>
                            <div class="flex items-start mb-6">
                                <div class="flex items-center h-5">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        value=""
                                        class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                                        required
                                        onChange={(e) => setCheckoutInfo((prev) => ({ ...prev, isRemember: e.target.checked }))}
                                    />
                                </div>
                                <label
                                    for="remember"
                                    class="ms-2 text-sm font-medium text-gray-900"
                                >
                                    Remember this address for future orders
                                </label>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <h2 id="accordion-open-heading-2">
                <button
                    type="button"
                    onClick={() => toggleAccordion(2)}
                    aria-expanded={openSection === 2}
                    class="flex items-center justify-between w-full py-5 font-medium rtl:text-right text-gray-500 border-b-2 border-gray-400"
                    data-accordion-target="#accordion-open-body-2"

                    aria-controls="accordion-open-body-2"
                >
                    <span class="text-xl font-bold">Payment method</span>
                    <svg
                        data-accordion-icon
                        class="w-3 h-3 rotate-180 shrink-0"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5 5 1 1 5"
                        />
                    </svg>
                </button>
            </h2>
            <div
                style={{ display: openSection === 2 ? 'block' : 'none' }}
                id="accordion-open-body-2"
                class="hidden"
                aria-labelledby="accordion-open-heading-2"
            >
                <div class="py-5 border-b-2 border-gray-400">
                    <div>
                        <ul
                            id="default-tab"
                            data-tabs-toggle="#default-tab-content"
                            role="tablist"
                        >
                            <li class="my-2">
                                <input
                                    type="radio"
                                    id="COD"
                                    name="paymentMethod"
                                    value="COD"
                                    className="w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                    data-tabs-target="#cod"
                                    role="tab"
                                    aria-controls="cod"
                                    aria-selected="false"
                                />
                                <label for="COD" class="font-semibold">
                                    Cash On Delivery (COD)
                                </label>
                            </li>
                            <li class="me-2 my-5" role="presentation">
                                <input
                                    type="radio"
                                    id="creditCard"
                                    name="paymentMethod"
                                    value="creditCard"
                                    className="w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                    data-tabs-target="#card"
                                    role="tab"
                                    aria-controls="card"
                                    aria-selected="false"
                                />
                                <label for="creditCard" class="font-semibold">
                                    Card
                                </label>
                            </li>
                        </ul>
                    </div>
                    <div id="default-tab-content">
                        <div
                            class="hidden"
                            id="cod"
                            role="tabpanel"
                            aria-labelledby="cod-tab"
                        ></div>
                        <div
                            class="hidden p-4 rounded-lg bg-gray-50 border-gray-200"
                            id="card"
                            role="tabpanel"
                            aria-labelledby="card-tab"
                        >
                            <form>
                                <div class="space-y-6">
                                    <div>
                                        <label
                                            for="cardNumber"
                                            class="block mb-2 text-sm font-medium text-gray-900"
                                        >
                                            Card number
                                        </label>
                                        <input
                                            type="number"
                                            id="cardNumber"
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            for="cardName"
                                            class="block mb-2 text-sm font-medium text-gray-900"
                                        >
                                            Name on card
                                        </label>
                                        <input
                                            type="text"
                                            id="cardName"
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                            required
                                        />
                                    </div>
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                for="cardDate"
                                                class="block mb-2 text-sm font-medium text-gray-900"
                                            >
                                                Expiration Date
                                            </label>
                                            <input
                                                type="number"
                                                id="cardNumber"
                                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                placeholder="MM/YY"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label
                                                for="cardCVC"
                                                class="block mb-2 text-sm font-medium text-gray-900"
                                            >
                                                CVC
                                            </label>
                                            <input
                                                type="number"
                                                id="cardCVC"
                                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <h2 id="accordion-open-heading-3">
                <button
                    type="button"
                    onClick={() => toggleAccordion(3)}
                    aria-expanded={openSection === 3}
                    class="flex items-center justify-between w-full py-5 font-medium rtl:text-right text-gray-500 border-b-2 border-gray-400 gap-3"
                    data-accordion-target="#accordion-open-body-3"

                    aria-controls="accordion-open-body-3"
                >
                    <span class="text-xl font-bold">Review your order</span>
                    <svg
                        data-accordion-icon
                        class="w-3 h-3 rotate-180 shrink-0"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5 5 1 1 5"
                        />
                    </svg>
                </button>
            </h2>
            <div
                style={{ display: openSection === 3 ? 'block' : 'none' }}
                id="accordion-open-body-3"
                class="hidden"
                aria-labelledby="accordion-open-heading-3"
            >
                <div class="py-5 border-b-2 border-gray-400">
                    <div class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 mb-2">
                        <div class="container mb-3">
                            <div class="order-content">
                                <div class="checkout order-details">
                                    {products && products.map((product, i) => (
                                        <>
                                            <div class="order-columns">
                                                <div class="order-info-product px-3">
                                                    <span class="text-lg font-semibold text-gray-900">
                                                        {product.product_name}
                                                    </span>
                                                    <br />
                                                    <div class="flex items-center justify-between">
                                                        <span class="text-base font-bold text-gray-900">
                                                            ${product.price}
                                                        </span>
                                                        <span class="text-base font-bold text-gray-900">
                                                            x{product.quantity}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="order-product-img">
                                                    <img alt=""
                                                        src={product.image_link}
                                                    />
                                                </div>
                                            </div>
                                            {(i + 1) !== products.length && <hr class="h-px my-8 bg-gray-200 border-0" />}
                                        </>
                                    ))}
                                </div>
                            </div>
                            <hr class="h-px my-5 border-0 bg-gray-700" />
                            <div class="order-total mb-3 text-right font-semibold">
                                Total: ${price}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}