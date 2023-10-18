BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Sentence] (
    [id] INT NOT NULL IDENTITY(1,1),
    [sentence] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Sentence_pkey] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
