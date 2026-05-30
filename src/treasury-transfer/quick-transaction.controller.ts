import { Controller, Get, Post, Put, Body, Query } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

interface QuickTransaction {
  id: string;
  senderId: number;
  senderAccountName: string;
  recipientId: number;
  recipientName: string;
  transferType: number;
  numberOfTransfers: number;
  eachTransferAmount: number;
  description: string | null;
  comment: string | null;
  status: string;
  createdAt: string;
}

const items: QuickTransaction[] = [
  {
    id: uuidv4(),
    senderId: 1,
    senderAccountName: 'Ana Hazine Hesabı',
    recipientId: 1,
    recipientName: 'Ali Veli Ödeme Hesabı',
    transferType: 2,
    numberOfTransfers: 3,
    eachTransferAmount: 10000,
    description: 'Örnek hazine transferi',
    comment: null,
    status: 'Pending',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: uuidv4(),
    senderId: 2,
    senderAccountName: 'Yedek Hazine Hesabı',
    recipientId: 2,
    recipientName: 'Ahmet Kaya Hesabı',
    transferType: 3,
    numberOfTransfers: 1,
    eachTransferAmount: 50000,
    description: 'Rutin transfer',
    comment: 'Acil',
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

@Controller('api/QuickTransaction')
export class QuickTransactionController {
  @Get()
  getAll() {
    return { data: items };
  }

  @Post()
  add(@Body() body: any) {
    const item: QuickTransaction = {
      id: uuidv4(),
      senderId: body.senderId,
      senderAccountName: body.senderAccountName || '',
      recipientId: body.recipientId,
      recipientName: body.recipientName || '',
      transferType: body.transferType,
      numberOfTransfers: body.numberOfTransfers,
      eachTransferAmount: body.eachTransferAmount,
      description: body.description || null,
      comment: body.comment || null,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    items.push(item);
    return { success: true, data: { id: item.id } };
  }

  @Put('delete')
  delete(@Query('id') id: string) {
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return { success: false };
    items.splice(index, 1);
    return { success: true, data: null };
  }
}
