import AssetItem from "./AssetItem";
import { useQuery } from "@tanstack/react-query";
import { API } from "@/api/api";
import { Skeleton } from "@/components/ui/skeleton";
import { TbCircleDotted } from "react-icons/tb";
import { useTonAddress } from "@tonconnect/ui-react";
import { useStore } from "@/store/store";
import { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { postEvent } from '@telegram-apps/sdk';


const AssetList = () => {
	const userFriendlyAddress = useTonAddress();
	const { setNetWorth } = useStore();
	const [showAllAssets, setShowAllAssets] = useState(false);

	const { data, isFetching } = useQuery({
		queryKey: ["assets"],
		queryFn: () => API.getAssetsByWallet(userFriendlyAddress),
	});

	useEffect(() => {
		if (data && data.assets) {
			const totalNetWorth = data.assets.reduce(
				(acc, asset) => acc + ((asset?.amount / Math.pow(10, 9)) * asset.price_usd),
				0
			);
			setNetWorth(totalNetWorth);
		}
	}, [data]);

	const assetsArr = data?.assets;

	if (isFetching && !assetsArr) {
		return (
			<div>
				{/* Skeleton loaders */}
				{[...Array(3)].map((_, index) => (
					<div key={index} className="flex items-center space-x-4 py-4">
						<Skeleton className="h-12 w-12 rounded-full bg-gray-200" />
						<div className="space-y-2">
							<Skeleton className="h-3 w-56 bg-gray-200" />
							<Skeleton className="h-3 w-40 bg-gray-200" />
						</div>
					</div>
				))}
			</div>
		);
	}

	if (!assetsArr) return <div>No assets</div>;

	// Sort assets by USD value in descending order
	const sortedAssets = [...assetsArr].sort((a, b) => {
		const aValue = (a.amount / Math.pow(10, 9)) * a.price_usd;
		const bValue = (b.amount / Math.pow(10, 9)) * b.price_usd;
		return bValue - aValue;
	});

	const visibleAssets = showAllAssets ? sortedAssets : sortedAssets.slice(0, 5);

	// Calculate the total value of the hidden assets
	const hiddenAssets = sortedAssets.slice(5);
	const hiddenAssetsValue = hiddenAssets.reduce(
		(acc, asset) => acc + ((asset.amount / Math.pow(10, 9)) * asset.price_usd),
		0
	);

	const handleCollapseClick = () => {
		
		setShowAllAssets(prevState => !prevState);
		postEvent('web_app_trigger_haptic_feedback', { type: 'impact', impact_style: 'soft' });	
	};

	return (
		<div className="relative">
			<div className="assets mb-4">
				<p className="font-semibold flex items-center text-xl mb-3">
					<TbCircleDotted className="mr-2 text-yellow-700 size-5" />
					Assets
					<span className="ml-1 text-gray-400 text-base">
						{sortedAssets.length === 0 ? "" : `(${sortedAssets.length})`}
					</span>
				</p>
				<table className="min-w-full rounded-lg overflow-hidden">
					<thead>
						<tr>
							<th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								ASSET / AMOUNT
							</th>
							<th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								PRICE
							</th>
							<th className="py-2 px-3 text-end text-xs font-medium text-gray-500 uppercase tracking-wider">
								USD VALUE
							</th>
						</tr>
					</thead>

					<tbody>
						{visibleAssets.map((asset, index) => (
							<AssetItem
								key={asset.name}
								id={index}
								address={asset.address}
								icon={asset?.image_url}
								name={asset?.name}
								amount={asset?.amount / Math.pow(10, 9)}
								price={asset?.price_usd}
							/>
						))}
					</tbody>
				</table>
			</div>

			

			{/* Button Container */}
			<div className="items-center mb-9 pl-2 pr-3">
				{!showAllAssets && sortedAssets.length > 5 && (
					<div className="flex justify-between items-center w-full">
						<button
							className="flex items-center w-full text-gray-500 rounded"
							onClick={handleCollapseClick}
						>
							<IoIosArrowDown className="bg-gray-200 p-1 rounded-full size-8 mr-4" />
							<span>{hiddenAssets.length} assets are hidden</span>
						</button>
						{hiddenAssets.length > 0 && (
							<span className="text-gray-600">
								${hiddenAssetsValue.toFixed(2)}
							</span>
						)}
					</div>
				)}

				{showAllAssets && (
					<button
						className="flex w-full items-center text-gray-500 rounded"
						onClick={handleCollapseClick}
					><IoIosArrowDown className=" rotate-180 bg-gray-200 p-1 rounded-full size-8 mr-4" />
					Show less
							
					</button>
				)}
			</div>

		</div>
	);
};

export default AssetList;
