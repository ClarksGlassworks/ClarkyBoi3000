const API_URL = "https://wp.clarksglassworks.com/graphql";
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

  const serverURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://clarksglassworks.com'
	const response = await fetch(`${serverURL}/api/product?id=${slug}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		});
	const data = await response.json();

	return data || null;
}
