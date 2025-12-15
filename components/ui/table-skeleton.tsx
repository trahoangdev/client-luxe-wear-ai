import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface TableSkeletonProps {
    rowCount?: number;
    columnCount?: number;
    showCheckbox?: boolean;
}

export function TableSkeleton({
    rowCount = 5,
    columnCount = 5,
    showCheckbox = true,
}: TableSkeletonProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {showCheckbox && (
                            <TableHead className="w-[40px]">
                                <Skeleton className="h-4 w-4" />
                            </TableHead>
                        )}
                        {Array.from({ length: columnCount }).map((_, i) => (
                            <TableHead key={i}>
                                <Skeleton className="h-4 w-[100px]" />
                            </TableHead>
                        ))}
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: rowCount }).map((_, i) => (
                        <TableRow key={i}>
                            {showCheckbox && (
                                <TableCell>
                                    <Skeleton className="h-4 w-4" />
                                </TableCell>
                            )}
                            {Array.from({ length: columnCount }).map((_, j) => (
                                <TableCell key={j}>
                                    <Skeleton className="h-4 w-full" />
                                </TableCell>
                            ))}
                            <TableCell>
                                <Skeleton className="h-8 w-8 rounded-full" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
