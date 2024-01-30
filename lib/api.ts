const API_URL = "https://wp.clarksglassworks.com/graphql";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

async function fetcher(query = "", { variables }: Record<string, any> = {}) {
	const headers = { "Content-Type": "application/json" };

	if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
		headers[
			"Authorization"
		] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
	}

	const res = await fetch(API_URL, {
		headers,
		method: "POST",
		body: JSON.stringify({
			query,
			variables,
		}),
	});

	const json = await res.json();
	if (json.errors) {
		console.error(json.errors);
		throw new Error("Failed to fetch API");
	}
	return json.data;
}

export function useFetchAPI(query, variables) {
	//@ts-ignore
	const { data, error, mutate } = useSWR([query, variables], fetcher);

	return {
		data,
		isLoading: !error && !data,
		isError: error,
		mutate,
	};
}

export function useGetCart() {
	const fetcher = (url) => fetch(url).then((res) => res.json());
	const { data, mutate, error } = useSWR("/api/getCart", fetcher);

	return {
		cart: data,
		isLoading: !data && !error,
		isError: error,
		mutate,
	};
}

export function useOrder(order_id) {

	console.log('fetch wooOrder >', order_id)
	const fetcher = (url) => fetch(url).then((res) => res.json());
	const { data, mutate, error } = useSWR(order_id ? "/api/order?id=" + order_id : null, fetcher, { refreshInterval: 1000 });

	return {
		order: data,
		isLoading: !data && !error,
		isError: error,
		mutate,
	};
}

export function useGetCustomer() {
	const fetcher = (url) => fetch(url).then((res) => res.json());
	const { data, mutate, error } = useSWR("/api/getCustomer", fetcher);

	return {
		customer: data,
		isLoading: !data && !error,
		isError: error,
		mutate,
	};
}

export function useScrollPosition() {
	const [scrollPosition, setScrollPosition] = useState("initial");

	useEffect(() => {
		const handleScroll = () => {
			const y = window.scrollY;
			const nearBottom =
				document.documentElement.scrollHeight - (window.innerHeight + 100);

			if (y < 500) {
				setScrollPosition("initial");
			} else if (y >= 500 && y < 1000) {
				setScrollPosition("scrolling");
			} else if (y >= 1000 && y <= 1400) {
				setScrollPosition("scrolling2");
			} else if ((y > 1400 && y <= 1600) || (y > 1600 && y < nearBottom)) {
				setScrollPosition("scrolling3");
			} else if (y >= nearBottom) {
				setScrollPosition("end");
			} else {
				// we seem to have a chunk at the bottom that gets detected
				setScrollPosition("scrolling3");
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return scrollPosition;
}

export async function addToCart(productId, quantity) {
	console.log("----->", productId, quantity);
	const response = await fetch("/api/addToCart", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ productId, quantity }),
	});

	if (!response.ok) {
		throw new Error("Network response was not ok");
	}

	const data = await response.json();
	return data;
}
export function usePreviewPost(id, idType = "DATABASE_ID") {
	const query = `
    query PreviewPost($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        databaseId
        slug
        status
      }
    }`;

	const { data, isLoading, isError, mutate } = useFetchAPI(query, {
		id,
		idType,
	});

	return {
		post: data?.post,
		isLoading,
		isError,
		mutate,
	};
}
export function useAllPostsWithSlug() {
	const query = `
    {
      posts(first: 10000) {
        edges {
          node {
            slug
          }
        }
      }
    }
  `;

	//@ts-ignore
	const { data, isLoading, isError, mutate } = useFetchAPI(query);

	return {
		posts: data?.posts,
		isLoading,
		isError,
		mutate,
	};
}
export function useWooCommerceProduct(slug) {
	const { data, mutate, error } = useSWR(`/api/product?id=${slug}`, fetcher);

	return {
		product: data,
		isLoading: !data && !error,
		isError: error,
		mutate,
	};
}

export function useWooCommerceProducts() {
	const fetcher = (url) => fetch(url).then((res) => res.json());
	const { data, mutate, error } = useSWR("/api/products", fetcher);

	return {
		products: data,
		isLoading: !data && !error,
		isError: error,
		mutate,
	};
}

//@ts-ignore
async function fetchAPI(query = "", { variables } = {}) {
	const headers = { "Content-Type": "application/json" };

	if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
		headers[
			"Authorization"
		] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
	}

	const res = await fetch(API_URL, {
		headers,
		method: "POST",
		body: JSON.stringify({
			query,
			variables,
		}),
	});

	const json = await res.json();
	if (json.errors) {
		console.error(json.errors);
		throw new Error("Failed to fetch API");
	}
	return json.data;
}

export async function getWooCommerceProducts({ featured = null }) {
	const whereClause =
		featured !== null ? `, where: { featured: ${featured} }` : "";
	const query = `
    {
      products(first: 10000${whereClause}) {
        edges {
          node {
            id
            name
            slug
            purchasable
            image {
              id
              sourceUrl(size: WOOCOMMERCE_THUMBNAIL)
            }
            ... on ProductWithPricing {
              price
              regularPrice
              salePrice
            }
          }
        }
      }
    }
  `;

	const data = await fetchAPI(query);

	return data?.products;
}

export async function getWooCommerceProduct(slug) {
	const serverURL =
		process.env.NODE_ENV === "development"
			? "http://localhost:3000"
			: "https://clarksglassworks.com";
	const response = await fetch(`${serverURL}/api/product?id=${slug}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const data = await response.json();

	console.log("data", data);
	console.log("response", response);
	return data;
}
