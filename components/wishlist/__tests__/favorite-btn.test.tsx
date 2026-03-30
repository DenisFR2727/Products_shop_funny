import { fireEvent, render, screen } from "@testing-library/react";
import FavoriteButton from "../favorite-btn";
import type { IProducts } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { toggleFavoriteProduct } from "@/lib/features/products/cartSlice";

jest.mock("@/lib/hooks", () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock("@/lib/features/products/cartSlice", () => ({
  toggleFavoriteProduct: jest.fn(),
}));

jest.mock("react-icons/md", () => ({
  MdFavorite: () => <span data-testid="favorite-filled" />,
  MdFavoriteBorder: () => <span data-testid="favorite-outline" />,
}));

const mockedUseAppDispatch = useAppDispatch as unknown as jest.Mock;
const mockedUseAppSelector = useAppSelector as unknown as jest.Mock;
const mockedToggleFavoriteProduct =
  toggleFavoriteProduct as unknown as jest.Mock;

const product: IProducts = {
  id: 1,
  title: "Test Product",
  description: "Description",
  category: "beauty",
  price: 100,
  discountPercentage: 10,
  rating: 4.5,
  stock: 10,
  brand: "Brand",
  weight: 1,
  warrantyInformation: "1 year",
  shippingInformation: "Fast shipping",
  availabilityStatus: "In Stock",
  returnPolicy: "30 days",
  minimumOrderQuantity: 1,
  images: "image.jpg",
  thumbnail: "thumb.jpg",
  amount: 1,
};

describe("FavoriteButton", () => {
  const dispatchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseAppDispatch.mockReturnValue(dispatchMock);
  });

  it("renders outline icon when product is not favorite", () => {
    mockedUseAppSelector.mockReturnValue([]);

    render(<FavoriteButton product={product} />);

    expect(screen.getByTestId("favorite-outline")).toBeInTheDocument();
    expect(screen.queryByTestId("favorite-filled")).not.toBeInTheDocument();
  });

  it("renders filled icon when product is favorite", () => {
    mockedUseAppSelector.mockReturnValue([product]);

    render(<FavoriteButton product={product} />);

    expect(screen.getByTestId("favorite-filled")).toBeInTheDocument();
    expect(screen.queryByTestId("favorite-outline")).not.toBeInTheDocument();
  });

  it("dispatches toggle action on click", () => {
    mockedUseAppSelector.mockReturnValue([]);
    mockedToggleFavoriteProduct.mockReturnValue({
      type: "products/toggleFavoriteProduct",
      payload: product,
    });

    render(<FavoriteButton product={product} />);

    fireEvent.click(screen.getByRole("button"));

    expect(mockedToggleFavoriteProduct).toHaveBeenCalledWith(product);
    expect(dispatchMock).toHaveBeenCalledWith({
      type: "products/toggleFavoriteProduct",
      payload: product,
    });
  });
});
