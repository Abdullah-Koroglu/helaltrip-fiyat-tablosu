"use client"
import Form from "@/components/form";
import HotelTable from "@/components/table";
import { Button } from "@/components/ui/button";
import VisibleTable from "@/components/VisibleTable";
import html2canvas from "html2canvas-pro";
import { useRef, useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";


const hotels = [
  "Wome Deluxe",
  "Angel's Marmaris",
  "Adenya Resort",
  "Şah Inn Paradise",
  "The Oba",
  "Adin Beach",
  "Bera Alanya",
  "Rizom Beach Kumluca",
  "Selge Beach",
  "Royal Teos",
  "Rizom Tatil Köyü",
]

const discountTable = [
  {
    hotel: "Wome Deluxe",
    discount: 15
  },
  {
    hotel: "Angel's Marmaris",
    discount: 10
  },
  {
    hotel: "Adenya Resort",
    discount: 15
  },
  {
    hotel: "Şah Inn Paradise",
    discount: 15
  },
  {
    hotel: "The Oba",
    discount: 15
  },
  {
    hotel: "Adin Beach",
    discount: 12,
  },
  {
    hotel: "Bera Alanya",
    discount: 15,
  },
  {
    hotel: "Rizom Beach Kumluca",
    discount: 15,
  },
  {
    hotel: "Selge Beach",
    discount: 15,
  },
  {
    hotel: "Royal Teos",
    discount: 25,
  },
  {
    hotel: "Rizom Tatil Köyü",
    discount: 15,
  },
]

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [takeEffectFromUrl, setTakeEffectFromUrl] = useState<boolean>(true)
  const [checkIn, setCheckIn] = useState<string>("")
  const [checkOut, setCheckOut] = useState<string>("")
  const [adultCount, setAdultCount] = useState<number>(0)
  const [childCount, setChildCount] = useState<number>(0)
  const [rows, setRows] = useState<any>([])
  const [childrenAges, setChildrenAges] = useState<number[]>([])
  const params = useParams() as any

  const tableRef = useRef<HTMLDivElement>(null)

  // URL'den verileri yükle
  useEffect(() => {
    if (takeEffectFromUrl) {
      const urlCheckIn = searchParams.get('checkIn') || "";
      const urlCheckOut = searchParams.get('checkOut') || "";
      const urlAdultCount = parseInt(searchParams.get('adultCount') || "0");
      const urlChildCount = parseInt(searchParams.get('childCount') || "0");
      const urlChildrenAges = searchParams.get('childrenAges') ?
        JSON.parse(decodeURIComponent(searchParams.get('childrenAges')!)) : [];
      const urlRows = searchParams.get('rows') ?
        JSON.parse(decodeURIComponent(searchParams.get('rows')!)) : [];

      setCheckIn(urlCheckIn);
      setCheckOut(urlCheckOut);
      setAdultCount(urlAdultCount);
      setChildCount(urlChildCount);
      setChildrenAges(urlChildrenAges);
      setRows(urlRows);
      setTakeEffectFromUrl(false)
    }
  }, [searchParams]);

  // URL'yi güncelle
  const updateURL = (newData: {
    checkIn?: string;
    checkOut?: string;
    adultCount?: number;
    childCount?: number;
    childrenAges?: number[];
    rows?: any[];
    updateHotels?: boolean;
  }) => {
    if (newData.updateHotels === false) return
    let newParams = new URLSearchParams(params)
    if (newData.checkIn !== undefined) newParams.set('checkIn', newData.checkIn);
    if (newData.checkOut !== undefined) newParams.set('checkOut', newData.checkOut);
    if (newData.adultCount !== undefined) newParams.set('adultCount', newData.adultCount.toString());
    if (newData.childCount !== undefined) newParams.set('childCount', newData.childCount.toString());
    if (newData.childrenAges !== undefined) newParams.set('childrenAges', encodeURIComponent(JSON.stringify(newData.childrenAges)));
    if (newData.rows !== undefined && newData.updateHotels) newParams.set('rows', encodeURIComponent(JSON.stringify(newData.rows)));

    if (newData.checkIn !== undefined) params.checkIn = newData.checkIn
    if (newData.checkOut !== undefined) params.checkOut = newData.checkOut
    if (newData.adultCount !== undefined) params.adultCount = newData.adultCount.toString()
    if (newData.childCount !== undefined) params.childCount = newData.childCount.toString()
    if (newData.childrenAges !== undefined) params.childrenAges = encodeURIComponent(JSON.stringify(newData.childrenAges))
    if (newData.rows !== undefined && newData.updateHotels) params.rows = encodeURIComponent(JSON.stringify(newData.rows))

    router.push(`?${newParams.toString()}`);
  };

  // State güncelleme fonksiyonları
  const handleCheckInChange = (value: string) => {
    setCheckIn(value);
    updateURL({ checkIn: value, updateHotels: true });
  };

  const handleCheckOutChange = (value: string) => {
    setCheckOut(value);
    updateURL({ checkOut: value, updateHotels: true });
  };

  const handleAdultCountChange = (value: number) => {
    setAdultCount(value);
    updateURL({ adultCount: value, updateHotels: true });
  };

  const handleChildCountChange = (value: number) => {
    setChildCount(value);
    const newChildrenAges = Array(value).fill(0);
    setChildrenAges(newChildrenAges);
    updateURL({ childCount: value, childrenAges: newChildrenAges, updateHotels: true });
  };

  const handleChildrenAgesChange = (value: number[]) => {
    setChildrenAges(value);
    updateURL({ childrenAges: value, updateHotels: true });
  };

  const handleRowsChange = (value: any[]) => {
    setRows(value);
    updateURL({ rows: value, updateHotels: false });
  };

  return (
    <div>
      <Form
        checkIn={checkIn}
        setCheckIn={handleCheckInChange}
        checkOut={checkOut}
        setCheckOut={handleCheckOutChange}
        adultCount={adultCount}
        setAdultCount={handleAdultCountChange}
        childCount={childCount}
        setChildCount={handleChildCountChange}
        hotels={hotels}
        rows={rows}
        setRows={(value: any[]) => {
          setRows(value)
          updateURL({ rows: value, updateHotels: false })
        }}
        childrenAges={childrenAges}
        setChildrenAges={handleChildrenAgesChange}
      />
      <HotelTable
        rows={rows}
        setRows={handleRowsChange}
        discountTable={discountTable}
      />
      <div className="flex justify-center mt-4 mb-4 ">
        <Button onClick={() => {
          html2canvas(tableRef.current as HTMLElement).then((canvas: any) => {
            const link = document.createElement("a")
            link.href = canvas.toDataURL("image/png")
            link.download = "table.png"
            link.click()
          })
        }}>
          Tabloyu PDF'e çevir
        </Button>
      </div>
      <VisibleTable
        rows={rows}
        adultCount={adultCount}
        childCount={childCount}
        checkIn={checkIn}
        checkOut={checkOut}
        tableRef={tableRef}
        childrenAges={childrenAges} />
    </div>
  );
}
