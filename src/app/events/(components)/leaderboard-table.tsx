import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'

export default function LeaderboardTable() {
  return (
    <Table>
      <TableCaption>HARCODE ROUND HERE</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[25px]">POS</TableHead>
          <TableHead>Player</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Thru</TableHead>
          <TableHead>R1</TableHead>
          <TableHead>R2</TableHead>
          <TableHead>R3</TableHead>
          <TableHead>R4</TableHead>
          <TableHead>Odds to Win</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>CUT</TableCell>
          <TableCell>Scottie Scheffler</TableCell>
          <TableCell>-8</TableCell>
          <TableCell>3</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
