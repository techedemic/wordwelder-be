/*
  Warnings:

  - You are about to drop the column `sentence` on the `Sentence` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Sentence` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Sentence] DROP COLUMN [sentence];
ALTER TABLE [dbo].[Sentence] ADD [createdAt] DATETIME2 NOT NULL CONSTRAINT [Sentence_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
[updatedAt] DATETIME2 NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[Word] (
    [id] INT NOT NULL IDENTITY(1,1),
    [word] NVARCHAR(1000) NOT NULL,
    [word_type] NVARCHAR(1000) NOT NULL CONSTRAINT [Word_word_type_df] DEFAULT 'noun',
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Word_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [Word_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[SentenceWord] (
    [sentenceId] INT NOT NULL,
    [wordId] INT NOT NULL,
    CONSTRAINT [SentenceWord_pkey] PRIMARY KEY CLUSTERED ([sentenceId],[wordId])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Word_word_type_idx] ON [dbo].[Word]([word_type]);

-- AddForeignKey
ALTER TABLE [dbo].[SentenceWord] ADD CONSTRAINT [SentenceWord_sentenceId_fkey] FOREIGN KEY ([sentenceId]) REFERENCES [dbo].[Sentence]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SentenceWord] ADD CONSTRAINT [SentenceWord_wordId_fkey] FOREIGN KEY ([wordId]) REFERENCES [dbo].[Word]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
